var React = require('react');
var Status = require('../common').Status;
var Row = require('./Row');
var _ = require('lodash');

function getSummary(test_cases) {
  var summary = {};
  test_cases.forEach(function(c) {
    if (!summary[c.status]) {
      summary[c.status] = 0;
    }
    summary[c.status] += 1;
  });
  return summary;
};

var Group = React.createClass({
  getInitialState: function() {
    return {
    };
  },


  render: function() {
    var name = this.props.name;
    var testCaseRows = this.props.testCases.map(function (testCase, i) {
      return (
        <Row
          key={_.uniqueId('tcr')}
          data={testCase} />
      );
    }, this);
    var gid = _.uniqueId('g');
    var lid = _.uniqueId('l');
    return (
      <div id={gid}>
        <a className="list-group-item hideOverflow"
          data-toggle="collapse"
          data-target={'#' + lid}
          data-parent={'#' + gid}>
          {name}
          <div className="pull-right">
            <Status data={getSummary(this.props.testCases)} withPassRate={false} />
          </div>
        </a>
        <div className="sublinks collapse" id={lid}>
          {testCaseRows}
        </div>
      </div>
    );
  }
});

module.exports = Group;
