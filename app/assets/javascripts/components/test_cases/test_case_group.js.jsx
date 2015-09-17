var TestCaseGroup = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  handleClick: function(i) {
    this.props.onItemSelected(this.props.testCases[i]);
  },

  render: function() {
    var name = this.props.name;
    var testCaseRows = this.props.testCases.map(function (testCase, i) {
      return (
        <TestCaseRow
          key={_.uniqueId('tcr')}
          data={testCase}
          onClick={this.handleClick.bind(this, i)} />
      );
    }, this);
    var gid = _.uniqueId('g');
    var lid = _.uniqueId('l');
    return (
      <div id={gid}>
        <a href="#"
          className="list-group-item hideOverflow"
          data-toggle="collapse"
          data-target={'#' + lid}
          data-parent={'#' + gid}>{name}</a>
        <div className="sublinks collapse" id={lid}>
          {testCaseRows}
        </div>
      </div>
    );
  }
});
