import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';
import {updateListView} from './listView';
import {updateDiffView} from './diffView';

const ACTION = constants('TEST_CASE_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE_DETAIL',
  'RECEIVE_DIFF',
  'RECEIVE_HISTORY',
  'UPDATE_COMMENT',
]);

function receiveDetail(json) {
  console.info('size', json.test_cases.length);
  const data = _.indexBy(json.test_cases, 'id');
  const grouped = _.values(_.groupBy(json.test_cases, 'md5'));
  const dupFree = grouped.map((group) => {
    const latest = _.max(group, (d) => {return Date.parse(d.start);});
    return latest.id;
  });
  return {
    type: ACTION.RECEIVE_DETAIL,
    data: data,
    dupFree: dupFree,
    receivedAt: Date.now()
  };
}

function receiveDiff(json) {
  const all = _.indexBy(json.current.concat(json.prev), 'id');
  const current = _.mapValues(_.indexBy(json.current, 'md5'), (d) => d.id);
  const prev = _.mapValues(_.indexBy(json.prev, 'md5'), (d) => d.id);
  return {
    type: ACTION.RECEIVE_DIFF,
    all,
    current,
    prev,
    receivedAt: Date.now()
  };
}

function request() {
  return {
    type: ACTION.REQUEST
  };
}

function shouldFetch(state) {
  const data = state.testCase.data;
  if (!data) {
    return true;
  }
  if (!data.isFetching && _.isEmpty(data.all)) {
    return true;
  }
  return false;
}

export function fetchDetail() {
  return (dispatch, getState) => {
    const state = getState();
    const { runId } = state.router.params;
    if (shouldFetch(state)) {
      dispatch(request());
      const url = `/api/test_runs/${runId}/test_cases`;
      console.info('fetching test cases', url);
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receiveDetail(json)))
        .then(() => dispatch(updateListView(getState())));
    } else {
      return Promise.resolve();
    }
  };
}

export function fetchDiff() {
  return (dispatch, getState) => {
    const state = getState();
    const { id1, id2 } = state.router.params;
    if (shouldFetch(state)) {
      dispatch(request());
      const url = `/api/test_runs/diff/${id1}/${id2}`;
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receiveDiff(json)))
        .then(() => dispatch(updateDiffView(getState())));
    } else {
      return Promise.resolve();
    }
  };
}

export function gotHistory(id, json) {
  return {
    type: ACTION.RECEIVE_HISTORY,
    id,
    data: json
  };
}

export function updateComment(json) {
  return {
    type: ACTION.UPDATE_COMMENT,
    id: json.id,
    comments: json.comments
  };
}


export function invalidate() {
  return {
    type: ACTION.INVALIDATE
  };
}

// reducer

import { combineReducers } from 'redux';

export default function reducer(state = {
  isFetching: false,
  diff: {},
  all: {},
  dupFree: []
}, action) {
  switch(action.type) {
  case ACTION.INVALIDATE:
    return _.assign({}, state, {
      all: {},
      dupFree: []
    });
  case ACTION.REQUEST:
    return _.assign({}, state, {
      isFetching: true
    });
  case ACTION.RECEIVE_DETAIL:
    return _.assign({}, state, {
      isFetching: false,
      all: action.data,
      dupFree: action.dupFree,
      lastUpdated: action.receivedAt
    });
  case ACTION.RECEIVE_DIFF:
    return _.assign({}, state, {
      isFetching: false,
      all: action.all,
      diffMap: {
        current: action.current,
        prev: action.prev
      },
      lastUpdated: action.receivedAt
    });
  case ACTION.RECEIVE_HISTORY:
    state.all[action.id] = _.assign({}, state.all[action.id], {
      history: action.data
    });
    return _.assign({}, state);
  case ACTION.UPDATE_COMMENT:
    state.all[action.id] = _.assign({}, state.all[action.id], {
      comments: action.comments
    });
    return _.assign({}, state);
  default:
    return state;
  }
}
