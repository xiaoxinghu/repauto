var React = require('react');
var Group = require('./Group');
var Stretchable = require('../common').Stretchable;
var Action = require('../../actions/TestCaseActions');
var _ = require('lodash');

var GroupedList = React.createClass({

  render: function() {
    var grouped = this.props.data;

    var groups = Object.keys(grouped);
    var groupedTestCases = groups.map(function (g){
      return (
        <Group
          key={_.uniqueId('tcg-')}
          name={g}
          testCases={grouped[g]} />
      );
    }, this);
    return (
      <Stretchable>
        {groupedTestCases}
      </Stretchable>
    );
  }
});

module.exports = GroupedList;
