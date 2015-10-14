var TestRunDetail, TestRunDiff, TestRunIndex, ready;

TestRunIndex = require('./components/test_run/Index');
TestRunDetail = require('./components/test_run/Detail');
TestRunDiff = require('./components/test_run/Diff');
ProjectTrend = require('./components/project/Trend')
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

ready = function() {
  return $('div[data-load]').each(function() {
    var path;
    path = $(this).attr('data-load');
    $.get(path);
  });
};

$(document).ready(ready);

$(document).on('page:change', ready);

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
      var constructor = eval(className);
      var propsJson = node.getAttribute(window.ReactAutoMount.PROPS_ATTR);
      var props = propsJson && JSON.parse(propsJson);
      ReactDOM.render(React.createElement(constructor, props), node);
      // console.debug(nodes, className, constructor, propsJson, props);
    }
  }
}

$(function() {
  console.log('hey!');
  window.ReactAutoMount.mountComponents();
});

// ReactDOM.render(
//   <TestRunIndex />,
//   document.getElementById('TestRunIndex')
// );
