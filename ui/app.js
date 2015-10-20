var TestRunIndex = require('./components/test_run/Index');
var TestRunDiff = require('./components/test_run/Diff');
var ProjectTrend = require('./components/project/Trend');
var MiniTrend = require('./components/project/MiniTrend');
var TestRunDetail = require('./components/test_run/Detail');

import { TestRunList } from './containers';
// import TestRunDetail from './containers/TestRun/Detail'
var containers = {
  'TestRunDetail': TestRunDetail,
  'TestRunList': TestRunList,
  'TestRunIndex': TestRunIndex,
  'MiniTrend': MiniTrend,
  'ProjectTrend': ProjectTrend,
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
      // ReactDOM.render(<Detail />, node);
      ReactDOM.render(React.createElement(containers[className], props), node);
      // ReactDOM.render(React.createElement(constructor, props), node);
      // console.debug(nodes, className, constructor, propsJson, props);
    }
  }
}

$(function() {
  window.ReactAutoMount.mountComponents();
});
