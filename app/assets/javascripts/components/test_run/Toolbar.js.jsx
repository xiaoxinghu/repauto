var TestRunStore = require('../../stores/TestRunStore').store;
var Action = require('../../actions/TestRunActions');

var Toolbar = React.createClass({

  getInitialState: function() {
    return {
      selectedTestRuns: []
    };
  },

  componentDidMount: function() {
    TestRunStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TestRunStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({selectedTestRuns: TestRunStore.getSelected()});
  },

  _handleDelete: function() {
    TestRunStore.getSelected().forEach(function(id) {
      Action.remove(id);
    })
  },

  render: function() {
    var numSelected = this.state.selectedTestRuns.length;
    var buttons = [];
    if (numSelected > 0) {
      buttons.push(
        <button key='delete' type="button" className="btn btn-default" onClick={this._handleDelete}>delete</button>
      );
    }
    if (numSelected == 2) {
      buttons.push(
        <button key='diff' type="button" className="btn btn-default disabled">diff</button>
      );
    }
    // var buttons = ([
    // ]);

    return (
      <div className="toolbar inline pull-right">
        <div className="btn-group" role="group" aria-label="...">
          {buttons}
        </div>
      </div>
    );
  }
});

module.exports = Toolbar;
