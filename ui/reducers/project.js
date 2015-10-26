import {
  project
}
from '../actions';
import _ from 'lodash';

// the reducer
export default function reducer(state = {
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
