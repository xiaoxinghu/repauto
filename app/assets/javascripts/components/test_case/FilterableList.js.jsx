var SearchBar = require('../common').SearchBar;
var RadioSet = require('../common').RadioSet;
var Group = require('./Group');
var TestCaseStore = require('../../stores/TestCaseStore');
var GroupBy = require('../../constants/TestCase').GroupBy;
var Actions = require('../../actions/TestCaseActions');

var FilterableList = React.createClass({
  propTypes: {
    source: React.PropTypes.string,
    onItemSelected: React.PropTypes.func
  },
  getInitialState: function() {
    TestCaseStore.init(this.props.source);
    return {
      data: {},
      groupBy: GroupBy.FEATURE,
      filterText: ''
    };
  },

  componentDidMount: function() {
    TestCaseStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TestCaseStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      data: TestCaseStore.getAll(),
      groupBy: TestCaseStore.getGroupBy()
    });
  },

  handleUserInput: function(filterText) {
    Actions.filter(filterText);
  },

  handleGroupByChange: function(view) {
    Actions.changeGroupBy(view);
  },

  onItemSelected: function(selected) {
    this.props.onItemSelected(selected);
  },

  render: function() {
    var grouped = this.state.data;

    var groups = Object.keys(grouped);
    var groupedTestCases = groups.map(function (g){
      return (
        <Group
          key={_.uniqueId('tcg-')}
          onItemSelected={this.onItemSelected}
          name={g}
          testCases={grouped[g]} />
      );
    }, this);
    var radios = [
      {label: (<i className="fa fa-star" />), value: GroupBy.FEATURE},
      {label: (<i className="fa fa-exclamation-triangle" />), value: GroupBy.ERROR},
      {label: (<i className="glyphicon glyphicon-th" />), value: GroupBy.GRID},
      {label: (<i className="fa fa-check-square-o" />), value: GroupBy.TODO}
    ];
    return (
      <div className="test-case-list">
        <div className="row">
          <SearchBar onUserInput={this.handleUserInput}/>
        </div>
        <div className="row">
          <RadioSet group="view" onChange={this.handleGroupByChange} radios={radios} selected={this.state.groupBy} />
        </div>
        <div className="row full-height fill">
          {groupedTestCases}
        </div>
      </div>
    );
  }
});

module.exports = FilterableList;
