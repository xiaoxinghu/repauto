import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('DIFF_VIEW_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE',
]);

function receive(json) {
  console.info('diff receive', json);
  return {
    type: ACTION.RECEIVE,
    current: _.indexBy(json.current, 'md5'),
    prev: _.indexBy(json.prev, 'md5'),
    receivedAt: Date.now()
  };
}

function request() {
  return {
    type: ACTION.REQUEST
  };
}

function shouldFetch(state) {
  const data = state.diffView.data;
  if (!data) {
    return true;
  }
  if (!data.isFetching && _.isEmpty(data.current)) {
    return true;
  }
  return false;
}

export function fetch() {
  return (dispatch, getState) => {
    const state = getState();
    const { id1, id2 } = state.router.params;
    if (shouldFetch(state)) {
      dispatch(request());
      const url = `/api/test_runs/diff?id1=${id1}&id2=${id2}`;
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receive(json)));
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
  current: {},
  prev: {}
}, action) {
  switch(action.type) {
  case ACTION.INVALIDATE:
    return _.assign({}, state, {
      current: {},
      prev: {}
    });
  case ACTION.REQUEST:
    return _.assign({}, state, {
      isFetching: true
    });
  case ACTION.RECEIVE:
    return _.assign({}, state, {
      isFetching: false,
      current: action.current,
      prev: action.prev,
      lastUpdated: action.receivedAt
    });
  default:
    return state;
  }
}
