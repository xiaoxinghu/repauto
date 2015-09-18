var Detail = React.createClass({
  getInitialState: function() {
    return {
      data: null
    };
  },

  componentDidMount: function() {
    PubSub.subscribe('selected', this.change);
  },

  change: function(msg, data) {
    this.setState({data: data});
  },

  render: function() {
    var testCase = (<div>Select Test Case from left.</div>);
    if (this.state.data != null) {
      testCase = (
        <div>
          <div>Name: {this.state.data.name}</div>
        </div>
      );
    }
    return (
      <div>
        {testCase}
      </div>
    );
  }
});

module.exports = Detail;
