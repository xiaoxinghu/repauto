import fetch from 'isomorphic-fetch';
import { constants } from '../../lib';
var actions = constants('TEST_RUN_', [
  'REQUEST',
  'RECEIVE',
  'FILTER_BY_TYPE',
  'SELECT'
])

export default function reducer(state, action = {}) {
  switch (action.type) {
    case actions.REQUEST:

      break;
    default:

  }
}

function fetch(testRun) {
  return dispatch => {
    dispatch(request(testRun));
    return fetch
  }
}

function shouldFetch(state, testRun) {

}

export function fetchIfNeeded(testRun) {
  return (dispatch, getState) => {
    if (shouldFetch(getState(), testRun)) {
      return dispatch(fetch(testRun));
    }
  };
}
