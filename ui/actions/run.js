import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from './constants';

export const ACTION = constants('RUN_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE',
  'FILTER',
  'MARK',
  'UNMARK',
  'REMOVED',
]);

export const VIEW = constants('VIEW_', [
  'ALL',
  'BIN'
]);

function receive(filter, json) {
  return {
    type: ACTION.RECEIVE,
    filter,
    data: json.test_runs,
    meta: json.meta,
    receivedAt: Date.now()
  };
}

function request(filter) {
  return {
    type: ACTION.REQUEST,
    filter
  };
}

function shouldFetch(state, filter, more) {
  const run = state.run.data;
  if (!run) {
    return true;
  }
  if (!run.isFetching && _.isEmpty(run.all)) {
    return true;
  }
  if (more && run.meta.nextPage) {
    return true;
  }
  return false;
}

function getUrl(state) {
  const projectId = state.router.params.projectId;
  const filter = state.run.filter;
  const nextPage = state.run.data.meta.nextPage;
  console.info('get url', projectId, filter);
  let url = `/api/test_runs?project=${projectId}&page=${nextPage}`;
  switch(filter) {
  case VIEW.ALL:
    break;
  case VIEW.BIN:
    url += `&archived=true`;
    break;
  default:
    url += `&name=${filter}`;
    break;
  }
  return url;
}

export function fetch(more = false) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetch(state, filter, more)) {
      console.debug('really fetching test Runs');
      dispatch(request(filter));
      const url = getUrl(state);
      console.info('url:', url);
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receive(filter, json)));
    } else {
      return Promise.resolve();
    }
  };
}

export function invalidate() {
  return {
    type: ACTION.INVALIDATE
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

export function filter(filter) {
  return {
    type: ACTION.FILTER,
    filter: filter
  };
}

function removed(id) {
  return {
    type: ACTION.REMOVED,
    id
  };
}

export function remove(id) {
  return (dispatch, getState) => {
    const state = getState();
    const filter = state.run.filter;
    let action = 'archive';
    if (filter == VIEW.BIN) {
      action = 'restore';
    }
    const url = `/api/test_runs/${id}/${action}`;
    return _fetch(url)
      .then(response => response.json())
      .then(json => dispatch(removed(id)));
  };
}
