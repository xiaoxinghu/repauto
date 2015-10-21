import 'babel-core/polyfill';
import {
  Navbar,
  TestRunList
} from './containers';
import { Provider } from 'react-redux';
import configureStore from './redux/store'
var containers = {
  'Navbar': Navbar,
  'TestRunList': TestRunList,
};

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

window.ReactAutoMount = {
  CLASS_NAME_ATTR: 'data-react-class',
  PROPS_ATTR: 'data-react-props',
  mountComponents: function() {
    var selector = '[' + window.ReactAutoMount.CLASS_NAME_ATTR + ']';
    var parent = document;
    var nodes = $(selector, parent);
    for (var i = 0; i < nodes.length; ++i) {
      var node = nodes[i];
      var className = node.getAttribute(window.ReactAutoMount.CLASS_NAME_ATTR);
      var propsJson = node.getAttribute(window.ReactAutoMount.PROPS_ATTR);
      var props = propsJson && JSON.parse(propsJson);
      const store = configureStore();

      console.debug(className);
      ReactDOM.render(React.createElement(Provider, {store: store},
        React.createElement(containers[className], props)
      ), node);
    }
  }
}

$(function() {
  window.ReactAutoMount.mountComponents();
});
