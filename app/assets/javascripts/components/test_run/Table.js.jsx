var Row = require('./Row');
var TestRunStore = require('../../stores/TestRunStore').store;
var Actions = require('../../actions/TestRunActions');

var Table = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },

  handleRowSelection: function(e) {
    if (e.target.checked) {
      Actions.select();
    } else {
      Actions.unselect();
    }
  },

  render: function() {
    var testRunRows = this.props.data.map(function (testRun) {
      return (
        <Row key={'row-' + testRun.id} data={testRun} selected={TestRunStore.getSelected().indexOf(testRun.id) > -1} />
      )
    })
    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={this.handleRowSelection}></input></th>
            <th>type</th>
            <th>start</th>
            <th>duration</th>
            <th>status</th>
            <th>progress</th>
          </tr>
        </thead>
        <tbody>
          {testRunRows}
        </tbody>
      </table>
    );
  }
});

module.exports = Table;
