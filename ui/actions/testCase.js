import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from './constants';

export const ACTION = constants('TEST_CASE_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE',
  'FILTER',
  'GROUP_BY',
  'UPDATE_LIST_VIEW',
  'SPOTLIGHT_ON',
  'SPOTLIGHT_REFRESH',
  'SPOTLIGHT_DIFF',
  'RECEIVE_HISTORY',
  'UPDATE_COMMENT',
]);

export const GROUP_BY = constants('TEST_CASE_GROUP_BY_', [
  'FEATURE',
  'ERROR',
  'GRID',
  'TODO',
]);

function receive(json) {
  return {
    type: ACTION.RECEIVE,
    data: _.indexBy(json.test_cases, 'id'),
    receivedAt: Date.now()
  };
}

function request() {
  return {
    type: ACTION.REQUEST
  };
}

function shouldFetch(state) {
  const data = state.testCase.data;
  if (!data) {
    return true;
  }
  if (!data.isFetching && _.isEmpty(data.all)) {
    return true;
  }
  return false;
}

export function fetch() {
  return (dispatch, getState) => {
    const state = getState();
    const { runId } = state.router.params;
    if (shouldFetch(state)) {
      dispatch(request());
      const url = `/api/test_runs/${runId}/detail`;
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receive(json)))
        .then(() => dispatch(updateListView(getState())));
    } else {
      return Promise.resolve();
    }
  };
}

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

function updateListView(state) {
  // filter
  const data = _.values(state.testCase.data.all);
  let filtered = data.filter((d) => {
    return d.name.toLowerCase().includes(state.testCase.listView.filter.toLowerCase());
  });
  // group
  let grouped = group(filtered, state.testCase.listView.groupBy);
  return {
    type: ACTION.UPDATE_LIST_VIEW,
    updated: _.mapValues(grouped, (list) => list.map((tc) => tc.id))
  };
}

function switchSpotlight(id) {
  return {
    type: ACTION.SPOTLIGHT_ON,
    id
  };
}

function gotHistory(id, json) {
  return {
    type: ACTION.RECEIVE_HISTORY,
    id,
    data: json
  };
}

export function spotlight(id) {
  return (dispatch, getState) => {
    dispatch(switchSpotlight(id));
    if (!getState().testCase.data.all[id].history) {
      const url = `/api/test_cases/${id}/history`;
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(gotHistory(id, json)));
    } else {
      return Promise.resolve();
    }
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

export function spotlightDiff(target) {
  return {
    type: ACTION.SPOTLIGHT_DIFF,
    with: target
  };
}

export function invalidate() {
  return {
    type: ACTION.INVALIDATE
  };
}

function updateComment(json) {
  return {
    type: ACTION.UPDATE_COMMENT,
    id: json.id,
    comments: json.comments
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
      .then(json => dispatch(updateComment(json)));
  };
}
