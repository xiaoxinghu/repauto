import { combineReducers } from 'redux';
import {
  testCase
}
from '../actions';
import _ from 'lodash';

function data(state = {
  isFetching: false,
  all: {},
  history: {}
}, action) {
  switch(action.type) {
  case testCase.ACTION.INVALIDATE:
    return _.assign({}, state, {
      all: {},
      history: {}
    });
  case testCase.ACTION.REQUEST:
    return _.assign({}, state, {
      isFetching: true
    });
  case testCase.ACTION.RECEIVE:
    return _.assign({}, state, {
      isFetching: false,
      all: action.data,
      lastUpdated: action.receivedAt
    });
  case testCase.ACTION.RECEIVE_HISTORY:
    let newState = _.assign({}, state);
    let newData = _.assign({}, state.all[action.id], {
      history: action.data
    });
    newState.all[action.id] = newData;
    return _.assign({}, newState);
  default:
    return state;
  }
}

function listView(state = {
  groupBy: testCase.GROUP_BY.FEATURE,
  filter: '',
  processed: {}
}, action) {
  switch(action.type) {
  case testCase.ACTION.UPDATE_LIST_VIEW:
    return _.assign({}, state, {
      processed: action.updated
    });
  case testCase.ACTION.GROUP_BY:
    return _.assign({}, state, {
      groupBy: action.by
    });
  case testCase.ACTION.FILTER:
    return _.assign({}, state, {
      filter: action.keyword
    });
  default:
    return state;
  }
}

function spotlight(state = {}, action) {
  switch(action.type) {
  case testCase.ACTION.SPOTLIGHT_ON:
    return _.assign({}, state, {
      on: action.id,
      diffWith: null
    });
  case testCase.ACTION.SPOTLIGHT_DIFF:
    return _.assign({}, state, {
      diffWith: action.with
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  data,
  listView,
  spotlight
});

export default rootReducer;
