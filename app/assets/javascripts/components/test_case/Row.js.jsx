var Actions = require('../../actions/TestCaseActions');

var Row = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    Actions.show([this.props.data.id]);
  },
  render: function() {
    var testCase = this.props.data;
    var display = [];
    if (testCase.comments && testCase.comments.length > 0) {
      console.log('got comment');
      display.push(
        <i className="fa fa-comment" />
      );
    }
    display.push(
      testCase.name
    );
    return (
      <a href="#"
        className={"hideOverflow list-group-item small list-group-item-" + getStatusMeta(testCase.status).context}
        onClick={this.onClick}>
        {display}
      </a>
    );
  }
});

module.exports = Row;
