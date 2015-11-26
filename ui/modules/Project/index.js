import { combineReducers } from 'redux';
import data from './data';
import trend from './trend';
import matrix from './matrix';
import summary from './summary';

const reducer = combineReducers({
  data,
  trend,
  summary,
  matrix
});

export * from './data';
export * from './trend';
export * from './matrix';
export * from './summary';

export default reducer;
