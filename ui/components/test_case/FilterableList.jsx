var React = require('react');
var SearchBar = require('../common').SearchBar;
var RadioSet = require('../common').RadioSet;
var Stretchable = require('../common').Stretchable;
var Group = require('./Group');
var GroupedList = require('./GroupedList');
var TestCaseStore = require('../../stores/TestCaseStore');
var GroupBy = require('../../constants/TestCase').GroupBy;
var Action = require('../../actions/TestCaseActions');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var FilterableList = React.createClass({
  // propTypes: {
  //   source: React.PropTypes.string
  // },
  mixins: [PureRenderMixin],

  getInitialState: function() {
    // console.debug(this.props.source);
    // console.debug(this.props.params);
    // Action.init(this.props.source);
    return {
      total: 0,
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
      total: TestCaseStore.getTotal()
    });
  },

  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText
    });
  },

  handleGroupByChange: function(groupBy) {
    this.setState({
      groupBy: groupBy
    });
  },

  render: function() {
    var grouped = TestCaseStore.getAll(this.state.groupBy, this.state.filterText);

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
        <GroupedList data={grouped} />
      </div>
    );
  }
});

module.exports = FilterableList;
