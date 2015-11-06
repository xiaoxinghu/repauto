import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import {reduxReactRouter} from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
// import reducer from './reducers';
import reducer from './modules';

const loggerMiddleware = createLogger();

// const createStoreWithMiddleware = applyMiddleware(
//   thunkMiddleware,
//   promiseMiddleware,
//   loggerMiddleware
// )(createStore);
const createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware, promiseMiddleware, loggerMiddleware),
  reduxReactRouter({ createHistory })
)(createStore);
export default function configureStore() {
  return createStoreWithMiddleware(reducer);
}
