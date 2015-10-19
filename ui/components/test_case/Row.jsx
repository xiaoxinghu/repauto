var React = require('react');
var Actions = require('../../actions/TestCaseActions');
var helper = require('../../helper');

var Row = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    Actions.show([this.props.data.id]);
  },
  render: function() {
    var testCase = this.props.data;
    var display = [];
    if (testCase.comments && testCase.comments.length > 0) {
      display.push(
        <i key="icon" className="fa fa-comment" />
      );
    }
    display.push(
      testCase.name
    );
    var style = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    return (
      <a href="#" style={style}
        className={"list-group-item small list-group-item-" + helper.getStatusMeta(testCase.status).context}
        onClick={this.onClick}>
        {display}
      </a>
    );
  }
});

module.exports = Row;
