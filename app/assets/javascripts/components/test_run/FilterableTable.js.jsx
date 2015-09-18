var Paginator = require('../common').Paginator;
var Table = require('./Table');

var FilterableTable = React.createClass({
  getInitialState: function() {
    return {
      test_runs: [],
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
  componentDidMount: function() {
    this.loadContent();
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
        <Table data={this.state.test_runs} />
      </div>
    );
  }
});

module.exports = FilterableTable;
