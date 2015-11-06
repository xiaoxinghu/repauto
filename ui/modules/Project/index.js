import { combineReducers } from 'redux';
import data from './data';
import trends from './trend';
import summary from './summary';

const reducer = combineReducers({
  data,
  trends,
  summary
});

export * from './data';
export * from './trend';
export * from './summary';

export default reducer;
