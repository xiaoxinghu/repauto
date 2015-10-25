import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from './constants';

export const ACTION = constants('TEST_RUN_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE',
  'FILTER',
  'MARK',
  'UNMARK',
]);

function receive(json) {
  return {
    type: ACTION.RECEIVE,
    data: json.test_runs,
    receivedAt: Date.now()
  };
}

function shouldFetch(state) {
  const run = state.run;
  if (!run.isFetching && _.isEmpty(run.all)) {
    return true;
  }
  return false;
}

export function fetch(projectId, name) {
  return (dispatch, getState) => {
    if (shouldFetch(getState())) {
      console.debug('really fetching test Runs');
      return _fetch(`/api/test_runs`)
        .then(response => response.json())
        .then(json => dispatch(receive(json)));
    } else {
      return Promise.resolve();
    }
  };
}

export function mark(id) {
  return {
    type: ACTION.MARK,
    id: id
  };
}

export function unmark(id) {
  return {
    type: ACTION.UNMARK,
    id: id
  };
}
