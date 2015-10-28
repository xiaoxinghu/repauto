import { combineReducers } from 'redux';
import {
  project
}
from '../actions';
import _ from 'lodash';

// the reducer
function reducer(state = {
  active: {},
  all: {}
}, action = {}) {
  switch (action.type) {
    case project.ACTION.RECEIVE:
      return _.assign({}, state, {
        all: action.projects,
        lastUpdated: action.receivedAt
      });
      break;
    default:
      return state;
  }
}

function trend(state = [], action = {}) {
  switch (action.type) {
    case project.ACTION.RECEIVE_TREND:
      return action.data;
    default:
      return state;
  }
}

function trends(state = {}, action) {
  switch (action.type) {
    case project.ACTION.RECEIVE_TREND:
      return _.assign({}, state, {
        [action.run]: trend(state[action.run], action)
      });
    case project.ACTION.INVALIDATE_TREND:
      return {};
    default:
      return state;
  }
}

function data(state = {
}, action) {
  switch (action.type) {
    case project.ACTION.RECEIVE:
      return action.projects
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  data,
  trends
});

export default rootReducer;
