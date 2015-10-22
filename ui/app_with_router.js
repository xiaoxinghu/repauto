import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/store'
import getRoutes from './routes';

const dest = document.getElementById('root');
const store = configureStore();
// const component = (
//   <ReduxRouter routes={getRoutes()} />
// )

ReactDOM.render(
  <Provider store={store}>
    {getRoutes()}
  </Provider>,
  dest
);
