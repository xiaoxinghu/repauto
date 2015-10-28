import { combineReducers } from 'redux';
import data from './data';
import list from './list';
import spotlight from './spotlight';

const reducer = combineReducers({
  data,
  list,
  spotlight
});

export { fetch, invalidate } from './data';
export { GROUP_BY, groupBy, filter } from './list';
export { spotlight, spotlightDiff, comment } from './spotlight';

export default reducer;
