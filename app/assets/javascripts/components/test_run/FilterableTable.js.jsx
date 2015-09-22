var Paginator = require('../common').Paginator;
var Toolbar = require('./Toolbar');
var Table = require('./Table');
var TestRunStore = require('../../stores/TestRunStore').store;
var BinStore = require('../../stores/TestRunStore').bin;

var FilterableTable = React.createClass({
  getInitialState: function() {
    TestRunStore.init(this.props.url);
    var all = TestRunStore.getAll();
    return {
      test_runs: all,
      meta: {
        total_pages: 0,
        current_page: 1,
        total_count: 0
      },
      fetchData: {
        page: 1
      }
    };
  },
  loadContent: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      data: this.state.fetchData,
      success: function(data) {
        this.setState({test_runs: data.test_runs, meta: data.meta});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  remove: function(msg, id) {
    var testRuns = this.state.test_runs.filter(function(d) {
      return d.id != id;
    });
    this.setState({test_runs: testRuns});
  },

  componentDidMount: function() {
    TestRunStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TestRunStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({test_runs: TestRunStore.getAll()});
  },

  _handleOnPageinate: function(pageNumber) {
    this.state.fetchData.page = pageNumber;
    this.loadContent();
    console.log('Paginator clicked.' + pageNumber);
  },

  render: function() {
    return (
      <div>
        <Paginator totalPages={this.state.meta.total_pages} currentPage={this.state.meta.current_page} onPaginate={this._handleOnPageinate} />
        <span>
          <Toolbar />
        </span>
        <Table data={this.state.test_runs} />
      </div>
    );
  }
});

module.exports = FilterableTable;
