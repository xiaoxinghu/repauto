import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('PROJECT_SUMMARY_', [
  'RECEIVE',
]);

function receive(json, id) {
  return {
    type: ACTION.RECEIVE,
    summary: json,
    id,
    receivedAt: Date.now()
  };
}

function shouldFetch(state, id) {
  const summary = state.project.summary;
  if (!summary.isFetching && _.isEmpty(summary[id])) {
    return true;
  }
  return false;
}

export function fetchSumamry(id) {
  return (dispatch, getState) => {
    if (shouldFetch(getState(), id)) {
      let url = `/api/projects/${id}/summary`;
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receive(json, id)));
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
    return _.assign({}, state, {
      [action.id]: action.summary
    });
    default:
      return state;
  }
}
