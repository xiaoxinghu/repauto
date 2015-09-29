var Status = require('../common').Status;
var Store = require('../../stores/TestRunStore').store;

var Info = React.createClass({

  getInitialState: function() {
    return {
      total: 0
    };
  },

  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({total: Store.getAll().length});
  },


  render: function() {
    sample = {
      passed: 'passed',
      failed: 'failed',
      broken: 'broken',
      pending: 'pending',
      pr: 'pass rate'
    }
    return (
      <div className="row">
        <div className="col-md-4">
          <strong>Showing {this.state.total} results.</strong>
        </div>
        <div className="col-md-8">
          <Status data={sample} />
          <span className="badge">todo</span>
          <p>Hold <em className="text-info">Ctrl</em> (<em className="text-info">⌘</em> on Mac) while clicking to select.</p>
        </div>
      </div>
    );
  }
});

module.exports = Info;
