import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
// import reducer from './modules/reducer';
import reducer from './modules/project';
import allReducer from './modules/reducer';
console.debug('project reducer', reducer);
console.debug('all reducer', allReducer);

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware,
  loggerMiddleware
)(createStore);

export default function configureStore() {
  console.debug('configureStore');
  return createStoreWithMiddleware(reducer);
}
