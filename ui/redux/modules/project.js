import fetch from 'isomorphic-fetch';
import { constants } from '../../lib';
import _ from 'lodash';
var actions = constants('PROJECT_', [
  'ACTIVATE',
  'FETCH',
  'RECEIVE',
]);

// actions
export function activateProject(projectId) {
  return {
    type: actions.ACTIVATE,
    projectId
  };
}

function receiveProjects(json) {
  return {
    type: actions.RECEIVE,
    projects: json,
    receivedAt: Date.now()
  }
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
  }
}

// the reducer
export default function reducer(state = {
  active: '',
  all: []
}, action = {}) {
  switch (action.type) {
    case actions.ACTIVATE:
      return _.assign({}, state, {active: action.projectId});
      break;
    case actions.RECEIVE:
      return _.assign({}, state, {
        all: action.projects,
        lastUpdated: action.receivedAt
      });
      break;
    default:
      return state;
  }
}
