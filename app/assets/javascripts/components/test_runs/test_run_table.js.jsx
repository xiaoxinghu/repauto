var TestRunTable = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },

  render: function() {
    var testRunRows = this.props.data.map(function (testRun) {
      return (
        <TestRunRow key={'row-' + testRun.id} data={testRun} />
      )
    })
    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th><input type="checkbox"></input></th>
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
