import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import project from './project';

export default combineReducers({
  router: routerStateReducer,
  project
});
