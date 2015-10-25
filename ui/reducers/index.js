import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import project from './project';
import run from './run';

export default combineReducers({
  router: routerStateReducer,
  project,
  run
});
