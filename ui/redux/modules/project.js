import fetch from 'isomorphic-fetch';
import { constants } from '../../lib';
import _ from 'lodash';
var actions = constants('PROJECT_', [
  'SELECT',
  'FETCH',
  'RECEIVE',
]);

// actions
export function selectProject(projectId) {
  return {
    type: actions.SELECT,
    projectId
  };
}

function receiveProjects(json) {
  console.debug('received projects:', json);
  return {
    type: actions.RECEIVE,
    projects: json,
    receivedAt: Date.now()
  }
}

export function fetchProjects() {
  console.debug('fetching...');
  return dispatch => {
    return fetch(`api/projects`)
      .then(response => response.json())
      .then(json => dispatch(receiveProjects(json)));
  }
}

// the reducer
export default function reducer(state = {
  selected: '',
  projects: []
}, action = {}) {
  switch (action.type) {
    case actions.SELECT:
      return _.assign({}, state, {selected: action.projectId});
      break;
    case actions.RECEIVE:
      return _.assign({}, state, {
        projects: action.projects,
        lastUpdated: action.receivedAt
      });
      break;
    default:
      return state;
  }
}
