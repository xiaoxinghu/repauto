import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('TEST_CASE_', [
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

function group(data, by) {
  let grouped;
  switch(by) {
  case GROUP_BY.FEATURE:
    grouped = _.groupBy(data, 'test_suite');
    break;
  case GROUP_BY.ERROR:
    let errored = data.filter((d) => d.failure);
    grouped = _.groupBy(errored, 'failure.message');
    break;
  case GROUP_BY.TODO:
    let todos = data.filter((d) => {
      return ( d.status != 'passed' ) && (d.comments.length == 0);
    });
    grouped = _.groupBy(todos, 'test_suite');
  default:
    break;
  }
  return grouped;
}

export function updateListView(state) {
  // filter
  const data = _.values(state.testCase.data.all);
  let filtered = data.filter((d) => {
    return d.name.toLowerCase().includes(state.testCase.list.filter.toLowerCase());
  });
  // group
  let grouped = group(filtered, state.testCase.list.groupBy);
  return {
    type: ACTION.UPDATE_LIST_VIEW,
    updated: _.mapValues(grouped, (list) => list.map((tc) => tc.id))
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
