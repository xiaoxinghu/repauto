var SearchBar = require('../common').SearchBar;
var RadioSet = require('../common').RadioSet;
var Group = require('./Group');

var FilterableList = React.createClass({
  propTypes: {
    url: React.PropTypes.string,
    onItemSelected: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      testCases: [],
      view: 'feature',
      filterText: ''
    };
  },
  loadContent: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({testCases: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.loadContent();
  },

  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText
    });
  },

  handleViewChange: function(view) {
    this.setState({view: view});
  },

  filter: function(testCases) {
    if (this.state.filterText === '') {
      return testCases;
    } else {
      var options = {
        keys: ['name']
      }
      var f = new Fuse(testCases, options);
      return f.search(this.state.filterText);
    }
  },

  group: function(testCases) {
    return groupBy(testCases, function(item) {
      switch (this.state.view) {
        case 'feature':
          return item.test_suite.name;
          break;
        case 'error':
          return item.failure ? item.failure.message : null;
          break;
        default:
          return item.test_suite.name;
          break;
      }
    });
  },

  onItemSelected: function(selected) {
    this.props.onItemSelected(selected);
  },

  render: function() {
    var filtered = this.filter(this.state.testCases);
    var view = this.state.view;
    var grouped = groupBy(filtered, function(item) {
      switch (view) {
        case 'feature':
          return item.test_suite.name;
          break;
        case 'error':
          return item.failure ? item.failure.message : null;
          break;
        default:
          return item.test_suite.name;
          break;
      }
    });
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
      {label: (<i className="fa fa-star" />), value: 'feature'},
      {label: (<i className="fa fa-exclamation-triangle" />), value: 'error'},
      {label: (<i className="glyphicon glyphicon-th" />), value: 'handset'},
      {label: (<i className="fa fa-check-square-o" />), value: 'todo'}
    ];
    // var radios = ['feature', 'error'].map(function(o) {
    //   return {label: o, value: o, checked: (o == this.state.view)};
    // }, this);
    return (
      <div className="test-case-list">
        <div className="row">
          <SearchBar onUserInput={this.handleUserInput}/>
        </div>
        <div className="row">
          <RadioSet group="view" onChange={this.handleViewChange} radios={radios} selected={this.state.view} />
        </div>
        <div className="row full-height fill">
          {groupedTestCases}
        </div>
      </div>
    );
  }
});

module.exports = FilterableList;
