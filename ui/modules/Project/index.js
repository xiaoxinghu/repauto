import { combineReducers } from 'redux';
import data from './data';
import trends from './trend';

const reducer = combineReducers({
  data,
  trends
})

export * from './data';
export * from './trend';

export default reducer;
