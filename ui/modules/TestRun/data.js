import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('RUN_', [
  'INVALIDATE',
  'REQUEST',
  'RECEIVE',
  'REMOVED',
  'FILTER',
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
  const run = state.testRun.data;
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
  const filter = state.testRun.data.filter;
  const nextPage = state.testRun.data.meta.nextPage;
  let url = `/api/projects/${projectId}/test_runs?page=${nextPage}`;
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
      dispatch(request(filter));
      const url = getUrl(state);
      console.info('fetch test run', url);
      return _fetch(url)
        .then(response => response.json())
        .then(json => dispatch(receive(filter, json)));
    } else {
      return Promise.resolve();
    }
  };
}

export function filter(filter) {
  return {
    type: ACTION.FILTER,
    filter: filter
  };
}

export function invalidate() {
  return {
    type: ACTION.INVALIDATE
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
    const filter = state.testRun.data.filter;
    let action = 'archive';
    if (filter == VIEW.BIN) {
      action = 'restore';
    }
    const url = `/api/test_runs/${id}/${action}`;
    console.info('remove url', url);
    return _fetch(url, {method: 'put'})
      .then(response => response.json())
      .then(json => dispatch(removed(id)));
  };
}

export default function reducer(state = {
  isFetching: false,
  meta: {
    currentPage: 0,
    nextPage: 1,
    totalPages: 0,
    totalCount: 0
  },
  all: [],
  filter: VIEW.ALL
}, action) {
  switch (action.type) {
    case ACTION.INVALIDATE:
      return _.assign({}, state, {
        all: [],
        filter: VIEW.ALL,
        meta: {
          currentPage: 0,
          nextPage: 1,
          totalPages: 0,
          totalCount: 0
        }
      });
    case ACTION.REQUEST:
      return _.assign({}, state, {
        isFetching: true
      });
    case ACTION.RECEIVE:
      return _.assign({}, state, {
        isFetching: false,
        all: state.all.concat(action.data),
        meta: {
          currentPage: action.meta.current_page,
          nextPage: action.meta.next_page,
          totalPages: action.meta.total_pages,
          totalCount: action.meta.total_count
        },
        lastUpdated: action.receivedAt
      });
    case ACTION.REMOVED:
      return _.assign({}, state, {
        all: state.all.filter((run) => run.id != action.id)
      });
  case ACTION.FILTER:
    return _.assign({}, state, {
      filter: action.filter
    });
    default:
      return state;
  }
}
