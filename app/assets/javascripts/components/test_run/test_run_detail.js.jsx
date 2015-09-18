var TestRunDetail = React.createClass({
  propTypes: {
    testCasesUrl: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      selected: null
    };
  },

  onItemSelected: function(selected) {
    console.log(selected.name);
    this.setState({selected: selected});
  },

  render: function() {
    var detail = (<div>No thing</div>);
    if (this.state.selected != null) {
      detail = (<TestCaseDetail data={this.state.selected} />);
    }
    return (
      <div className="row">
        <div className="col-sm-4 fill">
          <FilterableTestCaseList
            url={this.props.testCasesUrl}
            onItemSelected={this.onItemSelected} />
        </div>
        <div className="col-sm-8 fill">
          <TestCaseDetail />
        </div>
      </div>
    );
  }
});
