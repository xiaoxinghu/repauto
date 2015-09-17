var TestCaseRow = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    PubSub.publish('selected', this.props.data);
  },
  render: function() {
    var testCase = this.props.data;
    return (
      <a href="#"
        className={"hideOverflow list-group-item small list-group-item-" + statusmap(testCase.status)}
        onClick={this.onClick}>{testCase.name}</a>
    );
  }
});
