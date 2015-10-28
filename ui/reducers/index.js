import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import project from './project';
import testRun from './testRun';
import testCase from './testCase';

export default combineReducers({
  router: routerStateReducer,
  project,
  testRun,
  testCase
});
