import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('TEST_CASE_', [
  'INVALIDATE',
  'FILTER',
  'GROUP_BY',
  'UPDATE_LIST_VIEW',
]);

export const GROUP_BY = constants('TEST_CASE_GROUP_BY_', [
  'FEATURE',
  'ERROR',
  'GRID',
  'TODO',
]);

function group(all, ids, by) {
  let grouped;
  switch(by) {
  case GROUP_BY.FEATURE:
    grouped = _.groupBy(ids, (id) => all[id].test_suite);
    break;
  case GROUP_BY.ERROR:
    let errored = ids.filter((id) => all[id].failure);
    grouped = _.groupBy(errored, (id) => {
      // get rid of GUID
      const msg = all[id].failure.message.replace(
          /[{]?[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}[}]?/i,
        '<guid>');
      console.info(msg);
      return msg;
    });
    break;
  case GROUP_BY.TODO:
    let todos = ids.filter((id) => {
      return ( all[id].status != 'passed' ) && (all[id].comments.length == 0);
    });
    grouped = _.groupBy(todos, (id) => all[id].test_suite);
    break;
  case GROUP_BY.GRID:
    grouped = _.groupBy(ids, (id) => {
      return all[id].name.split('_')[0];
    });
    break;
  default:
    break;
  }
  return grouped;
}

export function updateListView(state) {
  // filter
  const { all, dupFree } = state.testCase.data;

  // filter by keywords
  let filtered = dupFree.filter((id) => {
    return all[id].name.toLowerCase().includes(state.testCase.listView.filter.toLowerCase());
  });

  // grouping
  let grouped = group(all, filtered, state.testCase.listView.groupBy);
  return {
    type: ACTION.UPDATE_LIST_VIEW,
    updated: grouped
  };
}

function changeGroupBy(by) {
  return {
    type: ACTION.GROUP_BY,
    by
  };
}

function setFilter(keyword) {
  return {
    type: ACTION.FILTER,
    keyword
  };
}

export function groupBy(by) {
  return (dispatch, getState) => {
    dispatch(changeGroupBy(by));
    dispatch(updateListView(getState()));
  };
}

export function filter(keyword) {
  return (dispatch, getState) => {
    dispatch(setFilter(keyword));
    dispatch(updateListView(getState()));
  };
}

// reducer

import { combineReducers } from 'redux';

export default function reducer(state = {
  groupBy: GROUP_BY.FEATURE,
  filter: '',
  processed: {}
}, action) {
  switch(action.type) {
  case ACTION.INVALIDATE:
    return _.assign({}, state, {
      groupBy: GROUP_BY.FEATURE,
      processed: {},
      filter: ''
    });
  case ACTION.UPDATE_LIST_VIEW:
    return _.assign({}, state, {
      processed: action.updated
    });
  case ACTION.GROUP_BY:
    return _.assign({}, state, {
      groupBy: action.by
    });
  case ACTION.FILTER:
    return _.assign({}, state, {
      filter: action.keyword
    });
  default:
    return state;
  }
}
