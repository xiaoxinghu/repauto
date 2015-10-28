import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from './constants';

export const ACTION = constants('PROJECT_', [
  'FETCH',
  'RECEIVE',
  'RECEIVE_TREND',
  'INVALIDATE_TREND',
]);

function receiveProjects(json) {
  return {
    type: ACTION.RECEIVE,
    projects: _.indexBy(json, 'id'),
    receivedAt: Date.now()
  };
}

function shouldFetch(state) {
  const project = state.project;
  if (!project.isFetching && _.isEmpty(project.data)) {
    return true;
  }
  return false;
}

export function fetch() {
  return (dispatch, getState) => {
    if (shouldFetch(getState())) {
      return _fetch(`/api/projects`)
        .then(response => response.json())
        .then(json => dispatch(receiveProjects(json)));
    } else {
      return Promise.resolve();
    }
  };
}

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
