import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import project from './project';
import run from './run';
import testCase from './testCase';

export default combineReducers({
  router: routerStateReducer,
  project,
  run,
  testCase
});
