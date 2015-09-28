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
    Store.getProgress(this.props.id);
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
    var data = this.state.data;
    if (data.todo == 0) {
      delete data['todo'];
    }
    return (
      <Status data={this.state.data} />
    );
  }
});

module.exports = Progress;
