import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';
import {updateListView} from './list';

const ACTION = constants('TEST_CASE_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE',
  'RECEIVE_HISTORY',
  'UPDATE_COMMENT',
]);

function receive(json) {
  return {
    type: ACTION.RECEIVE,
    data: _.indexBy(json.test_cases, 'id'),
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

export function fetch() {
  return (dispatch, getState) => {
    const state = getState();
    const { runId } = state.router.params;
    if (shouldFetch(state)) {
      dispatch(request());
      const url = `/api/test_runs/${runId}/detail`;
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receive(json)))
        .then(() => dispatch(updateListView(getState())));
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
  all: {},
}, action) {
  switch(action.type) {
  case ACTION.INVALIDATE:
    return _.assign({}, state, {
      all: {},
    });
  case ACTION.REQUEST:
    return _.assign({}, state, {
      isFetching: true
    });
  case ACTION.RECEIVE:
    return _.assign({}, state, {
      isFetching: false,
      all: action.data,
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
