var Row = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    PubSub.publish('selected', this.props.data);
  },
  render: function() {
    var testCase = this.props.data;
    return (
      <a href="#"
        className={"hideOverflow list-group-item small list-group-item-" + getStatusMeta(testCase.status).context}
        onClick={this.onClick}>{testCase.name}</a>
    );
  }
});

module.exports = Row;
