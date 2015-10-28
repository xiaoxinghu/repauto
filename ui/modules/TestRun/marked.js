import _fetch from 'isomorphic-fetch';
import _ from 'lodash';
import constants from '../../lib/constants';

const ACTION = constants('RUN_', [
  'MARK',
  'UNMARK',
  'REMOVED',
]);

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

export default function reducer(state = [], action) {
  switch (action.type) {
  case ACTION.MARK:
    let marked;
    if (action.id) {
      marked = _.uniq([action.id, ...state]);
    } else {
      marked = state.all.map((run) => run.id);
    }
    return marked;
  case ACTION.UNMARK:
    if (action.id) {
      marked = _.without(state, action.id);
    } else {
      marked = [];
    }
    return marked;
  default:
    return state;
  }
}
