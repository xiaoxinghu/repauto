import {
  run
}
from '../actions';
import _ from 'lodash';

// the reducer
export default function reducer(state = {
  isFetching: false,
  didInvalidate: false,
  name: 'ALL',
  marked: [],
  all: []
}, action) {
  switch (action.type) {
    case run.ACTION.INVALIDATE:
      return _.assign({}, state, {
        didInvalidate: true
      });
    case run.ACTION.REQUEST:
      return _.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case run.ACTION.RECEIVE:
      return _.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        all: action.data,
        lastUpdated: action.receivedAt
      });
    case run.ACTION.FILTER:
      return _.assign({}, state, {
        didInvalidate: true,
        name: action.name
      });
    case run.ACTION.MARK:
      let marked;
      if (action.id) {
        marked = _.uniq([action.id, ...state.marked]);
      } else {
        marked = state.all.map((run) => run.id);
      }
      return _.assign({}, state, {
        marked: marked
      });
    case run.ACTION.UNMARK:
      if (action.id) {
        marked = _.without(state.marked, action.id);
      } else {
        console.info('unmark all');
        marked = [];
      }
      return _.assign({}, state, {
        marked: marked
      });
    default:
      return state;
  }
}
