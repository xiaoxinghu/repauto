import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('TEST_CASE_', [
  'UPDATE_DIFF_VIEW',
]);

export function updateDiffView(state) {
  const {current, prev} = state.testCase.data.diffMap;
  const md5s = _.uniq(_.keys(current).concat(_.keys(prev)));
  // merge
  const updated = md5s.map((md5) => {
    return {
      current: current[md5],
      prev: prev[md5]
    };
  }).filter((d) => {
    return (!d.current || !d.prev || (d.current.status != d.prev.status));
  });
  return {
    type: ACTION.UPDATE_DIFF_VIEW,
    updated: updated
  };
}

// reducer

import { combineReducers } from 'redux';

export default function reducer(state = {
  processed: {}
}, action) {
  switch(action.type) {
  case ACTION.UPDATE_DIFF_VIEW:
    return _.assign({}, state, {
      processed: action.updated
    });
  default:
    return state;
  }
}
