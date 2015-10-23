import fetch from 'isomorphic-fetch';
import { constants } from '../../lib';
import _ from 'lodash';
const actions = constants('TEST_RUN_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE',
  'FILTER',
  'SELECT',
]);

// actions
// export function selectRun(name) {
//   return {
//     type: actions.SELECT,
//     name
//   };
// }

function receive(json) {
  return {
    type: actions.RECEIVE,
    data: json.test_runs,
    receivedAt: Date.now()
  }
}

function shouldFetch(state) {
  const run = state.run;
  if (!run.isFetching && _.isEmpty(run.all)) {
    return true;
  }
  return false;
}

export function fetchTestRuns(projectId, name) {
  return (dispatch, getState) => {
    if (shouldFetch(getState())) {
      console.debug('really fetching test Runs');
      return fetch(`/api/test_runs`)
        .then(response => response.json())
        .then(json => dispatch(receive(json)));
    } else {
      return Promise.resolve();
    }
  }
}

// the reducer
export default function reducer(state = {
  isFetching: false,
  didInvalidate: false,
  name: 'ALL',
  all: []
}, action) {
  switch (action.type) {
    case actions.INVALIDATE:
      return _.assign({}, state, {
        didInvalidate: true
      });
    case actions.REQUEST:
      return _.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case actions.RECEIVE:
      return _.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        all: action.data,
        lastUpdated: action.receivedAt
      });
    case actions.FILTER:
      return _.assign({}, state, {
        didInvalidate: true,
        name: action.name
      });
    default:
      return state;
  }
}
