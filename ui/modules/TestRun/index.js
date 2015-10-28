import { combineReducers } from 'redux';
import data from './data';
import marked from './marked';

const reducer = combineReducers({
  data,
  marked
});

export * from './data';
export * from './marked';

export default reducer;
