import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('PROJECT_', [
  'RECEIVE_MATRIX',
  'INVALIDATE_MATRIX',
]);

function receive(project, json) {
  return {
    type: ACTION.RECEIVE_MATRIX,
    project,
    data: json
  };
}

function shouldFetch(state) {
  const projectId = state.router.params.projectId;
  const matrix = state.project.matrix.data;
  return !(matrix && matrix[projectId]);
}

export function fetchMatrix() {
  return (dispatch, getState) => {
    let state = getState();
    const projectId = state.router.params.projectId;
    console.info('fetch Matrix');
    if (shouldFetch(getState())) {
      console.info('should do it');
      return _fetch(`/api/projects/${projectId}/matrix`)
        .then(response => response.json())
        .then(json => dispatch(receive(projectId, json)));
    } else {
      return Promise.resolve();
    }
  };
}

export function invalidateMatrix() {
  return {
    type: ACTION.INVALIDATE_MATRIX
  };
}

// reducer

function matrix(state = [], action = {}) {
  switch (action.type) {
    case ACTION.RECEIVE_MATRIX:
      return action.data;
    default:
      return state;
  }
}

export default function reducer(state = {
  data: {}
}, action) {
  switch (action.type) {
    case ACTION.RECEIVE_MATRIX:
    const data = _.assign({}, state.data, {
      [action.project]: matrix(state[action.project], action)
    });
    return _.assign({}, state, {
      data: data
    });
    case ACTION.INVALIDATE_MATRIX:
      return {};
    default:
      return state;
  }
}
