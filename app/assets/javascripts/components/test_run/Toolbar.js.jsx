var TestRunStore = require('../../stores/TestRunStore').store;
var Constants = require('../../constants/TestRun');

var Toolbar = React.createClass({

  getInitialState: function() {
    return {
      selectedTestRuns: []
    };
  },

  componentDidMount: function() {
    TestRunStore.addChangeListener(Constants.Event.SELECT, this._onChange);
  },

  componentWillUnmount: function() {
    TestRunStore.removeChangeListener(Constants.Event.SELECT, this._onChange);
  },

  _onChange: function() {
    this.setState({selectedTestRuns: TestRunStore.getSelected()});
  },

  render: function() {
    var numSelected = this.state.selectedTestRuns.length;
    var buttons = [];
    if (numSelected > 0) {
      buttons.push(
        <button type="button" className="btn btn-default">delete</button>
      );
    }
    if (numSelected == 2) {
      buttons.push(
        <button type="button" className="btn btn-default disabled">diff</button>
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
