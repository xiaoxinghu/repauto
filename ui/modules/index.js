import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import project from './Project';
import testRun from './TestRun';
import testCase from './TestCase';
import diffView from './DiffView';

console.info(testCase);
export default combineReducers({
  router: routerStateReducer,
  project,
  testRun,
  testCase,
  diffView
});
