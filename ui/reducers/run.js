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
  selected: [],
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
    case run.ACTION.SELECT:
      let selected;
      if (action.id) {
        selected = _.uniq([action.id, ...state.selected]);
      } else {
        selected = state.all.map((run) => run.id);
      }
      return _.assign({}, state, {
        selected: selected
      });
    case run.ACTION.UNSELECT:
      if (action.id) {
        selected = _.without(state.selected, action.id);
      } else {
        console.info('unselect all');
        selected = [];
      }
      return _.assign({}, state, {
        selected: selected
      });
    default:
      return state;
  }
}
