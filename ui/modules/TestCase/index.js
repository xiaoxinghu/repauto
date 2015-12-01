import { combineReducers } from 'redux';
import data from './data';
import listView from './listView';
import diffView from './diffView';
import spotlight from './spotlight';

const reducer = combineReducers({
  data,
  listView,
  diffView,
  spotlight
});

export { fetchDetail, fetchDiff, invalidate } from './data';
export { GROUP_BY, groupBy, filter } from './listView';
export { spotlight, spotlightDiff, comment, SPOTLIGHT_MODE } from './spotlight';

export default reducer;
