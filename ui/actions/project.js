import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from './constants';

export const ACTION = constants('PROJECT_', [
  'ACTIVATE',
  'FETCH',
  'RECEIVE',
]);

export function activateProject(projectId) {
  return {
    type: ACTION.ACTIVATE,
    projectId
  };
}

function receiveProjects(json) {
  return {
    type: ACTION.RECEIVE,
    projects: _.indexBy(json, 'id'),
    receivedAt: Date.now()
  };
}

function shouldFetch(state) {
  const project = state.project;
  if (!project.isFetching && _.isEmpty(project.all)) {
    return true;
  }
  return false;
}

export function fetchProjects() {
  return (dispatch, getState) => {
    if (shouldFetch(getState())) {
      return fetch(`/api/projects`)
        .then(response => response.json())
        .then(json => dispatch(receiveProjects(json)));
    } else {
      return Promise.resolve();
    }
  };
}
