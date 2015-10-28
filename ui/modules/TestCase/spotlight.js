import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';
import * as data from './data';

const ACTION = constants('TEST_CASE_', [
  'SPOTLIGHT_ON',
  'SPOTLIGHT_REFRESH',
  'SPOTLIGHT_DIFF',
]);

function switchSpotlight(id) {
  return {
    type: ACTION.SPOTLIGHT_ON,
    id
  };
}

export function spotlight(id) {
  return (dispatch, getState) => {
    dispatch(switchSpotlight(id));
    if (!getState().testCase.data.all[id].history) {
      const url = `/api/test_cases/${id}/history`;
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(data.gotHistory(id, json)));
    } else {
      return Promise.resolve();
    }
  };
}

export function spotlightDiff(target) {
  return {
    type: ACTION.SPOTLIGHT_DIFF,
    with: target
  };
}

export function comment(testCaseId, comment) {
  return (dispatch, getState) => {
    const url = `/api/test_cases/${testCaseId}/comment`;
    const body = JSON.stringify(comment);
    return _fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    }).then(response => response.json())
      .then(json => dispatch(data.updateComment(json)));
  };
}

// reducer

export default function reducer(state = {}, action) {
  switch(action.type) {
  case ACTION.SPOTLIGHT_ON:
    return _.assign({}, state, {
      on: action.id,
      diffWith: null
    });
  case ACTION.SPOTLIGHT_DIFF:
    return _.assign({}, state, {
      diffWith: action.with
    });
  case ACTION.SPOTLIGHT_REFRESH:
    return _.assign({}, state, {
      refresh: Date.now()
    });
  default:
    return state;
  }
}
