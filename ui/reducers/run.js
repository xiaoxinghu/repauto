import { combineReducers } from 'redux';
import {
  run
}
from '../actions';
import _ from 'lodash';

function marked(state = [], action) {
  switch (action.type) {
    case run.ACTION.MARK:
      let marked;
      if (action.id) {
        marked = _.uniq([action.id, ...state]);
      } else {
        marked = state.all.map((run) => run.id);
      }
    return marked;
    case run.ACTION.UNMARK:
      if (action.id) {
        marked = _.without(state, action.id);
      } else {
        console.info('unmark all');
        marked = [];
      }
    return marked;
    default:
      return state;
  }
}

function filter(state = run.VIEW.ALL, action) {
  switch (action.type) {
  case run.ACTION.INVALIDATE:
    return run.VIEW.ALL;
  case run.ACTION.FILTER:
    return action.filter;
  default:
    return state;
  }
}

function data(state = {
  isFetching: false,
  meta: {
    currentPage: 0,
    nextPage: 1,
    totalPages: 0,
    totalCount: 0
  },
  all: []
}, action) {
  switch (action.type) {
    case run.ACTION.INVALIDATE:
      return _.assign({}, state, {
        all: [],
        meta: {
          currentPage: 0,
          nextPage: 1,
          totalPages: 0,
          totalCount: 0
        }
      });
    case run.ACTION.REQUEST:
      return _.assign({}, state, {
        isFetching: true
      });
    case run.ACTION.RECEIVE:
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
    case run.ACTION.FILTER:
      return _.assign({}, state, {
        name: action.name
      });
    case run.ACTION.REMOVED:
      return _.assign({}, state, {
        all: state.all.filter((run) => run.id != action.id)
      });
    default:
      return state;
  }
}

function data_(state = {}, action) {
  switch(action.type) {
  case run.ACTION.INVALIDATE:
    return {};
  case run.ACTION.REQUEST:
  case run.ACTION.RECEIVE:
    return _.assign({}, state, {[action.filter]: runs(state[action.filter], action)});
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  marked,
  data,
  filter
});

export default rootReducer;
