var Status = require('../common').Status;
var Store = require('../../stores/TestRunStore').store;

var Progress = React.createClass({
  getInitialState: function() {
    return {
      data: Store.getProgress(this.props.id)
    };
  },

  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      this.setState({
        data: Store.getProgress(this.props.id)
      });
    }
  },

  render: function() {
    return (
      <Status data={this.state.data} />
    );
  }
});

module.exports = Progress;
