var TestCaseDetail = React.createClass({
  propTypes: {
    id: React.PropTypes.string
  },

  render: function() {
    return (
      <div>
        <div>Id: {this.props.id}</div>
      </div>
    );
  }
});
