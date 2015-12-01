import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';
import * as data from './data';

const ACTION = constants('TEST_CASE_', [
  'SPOTLIGHT_ON',
  'SPOTLIGHT_REFRESH',
  'SPOTLIGHT_DIFF',
]);

export const SPOTLIGHT_MODE = constants('TEST_CASE_SPOTLIGHT_MODE_', [
  'DETAIL',
  'GRID'
]);

function spotlightOn(ids, mode) {
  return {
    type: ACTION.SPOTLIGHT_ON,
    ids,
    mode
  };
}

export function spotlight(target, mode = SPOTLIGHT_MODE.DETAIL) {
  return (dispatch, getState) => {
    let ids = [];
    if (Array.isArray(target)) {
      ids = target;
      if (ids.length > 2) {
        mode = SPOTLIGHT_MODE.GRID;
      }
    } else if(typeof target === 'string') {
      ids = [target];
    }
    dispatch(spotlightOn(ids, mode));
    const id = ids[0]; // only fetch history for the first one.
    if (mode == SPOTLIGHT_MODE.DETAIL && !getState().testCase.data.all[id].history) {
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

export default function reducer(state = {
  on: []
}, action) {
  switch(action.type) {
  case ACTION.SPOTLIGHT_ON:
    return _.assign({}, state, {
      on: action.ids,
      diffWith: null,
      mode: action.mode
    });
  case ACTION.SPOTLIGHT_DIFF:
    return _.assign({}, state, {
      diffWith: action.with,
      mode: SPOTLIGHT_MODE.DETAIL
    });
  case ACTION.SPOTLIGHT_REFRESH:
    return _.assign({}, state, {
      refresh: Date.now()
    });
  default:
    return state;
  }
}
