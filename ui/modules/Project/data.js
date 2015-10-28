import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from './constants';

const ACTION = constants('PROJECT_', [
  'RECEIVE',
]);

function receive(json) {
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
        .then(json => dispatch(receive(json)));
    } else {
      return Promise.resolve();
    }
  };
}

// reducer
export default function reducer(state = {
}, action) {
  switch (action.type) {
    case ACTION.RECEIVE:
    return action.projects;
    default:
      return state;
  }
}
