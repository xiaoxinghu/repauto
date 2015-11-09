import { combineReducers } from 'redux';
import data from './data';
import trend from './trend';
import summary from './summary';

const reducer = combineReducers({
  data,
  trend,
  summary
});

export * from './data';
export * from './trend';
export * from './summary';

export default reducer;
