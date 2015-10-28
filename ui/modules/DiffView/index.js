import { combineReducers } from 'redux';
import data from './data';

const reducer = combineReducers({
  data,
});

// export { fetch, invalidate } from './data';
// export { GROUP_BY, groupBy, filter } from './list';
// export { spotlight, spotlightDiff, comment } from './spotlight';
export * from './data';

export default reducer;
