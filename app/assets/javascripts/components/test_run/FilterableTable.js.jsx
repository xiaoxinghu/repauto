var Paginator = require('../common').Paginator;
var Toolbar = require('./Toolbar');
var Table = require('./Table');
var List = require('./List');
var Store = require('../../stores/TestRunStore').store;
var BinStore = require('../../stores/TestRunStore').bin;

var FilterableTable = React.createClass({
  getInitialState: function() {
    Store.init(this.props.url);
    var all = Store.getAll();
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
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({test_runs: Store.getAll()});
  },

  _handleOnPageinate: function(pageNumber) {
    this.state.fetchData.page = pageNumber;
    this.loadContent();
    console.log('Paginator clicked.' + pageNumber);
  },

  _handleMoreButton: function() {
    Store.getMore();
  },

  render: function() {
    if (Store.isThereMore()) {
      var loadMore = (
        <ul className="pager">
          <li>
            <a href="#" onClick={this._handleMoreButton}>More</a>
          </li>
        </ul>
      );
    }
    return (
      <div>
        <Paginator totalPages={this.state.meta.total_pages} currentPage={this.state.meta.current_page} onPaginate={this._handleOnPageinate} />
        <span>
          <Toolbar />
        </span>
        <List data={this.state.test_runs} />
        {loadMore}
      </div>
    );
  }
});

module.exports = FilterableTable;
