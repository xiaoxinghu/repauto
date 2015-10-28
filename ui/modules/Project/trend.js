import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from './constants';

export const ACTION = constants('PROJECT_', [
  'RECEIVE_TREND',
  'INVALIDATE_TREND',
]);

function receiveTrend(run, json) {
  return {
    type: ACTION.RECEIVE_TREND,
    run,
    data: json
  };
}

function shouldFetchTrend(state, run) {
  const projectId = state.router.params.projectId;
  const trends = state.project.trends;
  return !(trends && trends[run]);
}

export function fetchTrend(run) {
  return (dispatch, getState) => {
    let state = getState();
    const projectId = state.router.params.projectId;
    if (shouldFetchTrend(getState(), run)) {
      return _fetch(`/api/projects/${projectId}/trend?name=${run}`)
        .then(response => response.json())
        .then(json => dispatch(receiveTrend(run, json)));
    } else {
      return Promise.resolve();
    }
  };
}

export function invalidateTrend() {
  return {
    type: ACTION.INVALIDATE_TREND
  };
}

// reducer

import { combineReducers } from 'redux';

function trend(state = [], action = {}) {
  switch (action.type) {
    case ACTION.RECEIVE_TREND:
      return action.data;
    default:
      return state;
  }
}

export default function trends(state = {}, action) {
  switch (action.type) {
    case ACTION.RECEIVE_TREND:
      return _.assign({}, state, {
        [action.run]: trend(state[action.run], action)
      });
    case ACTION.INVALIDATE_TREND:
      return {};
    default:
      return state;
  }
}
