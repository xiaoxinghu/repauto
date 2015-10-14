var React = require('react');
var Paginator = React.createClass({
  displayName: 'Paginator',
  _handleOnClick: function(pageNumber) {
    return this.props.onPaginate(pageNumber);
  },
  render: function() {
    if (this.props.totalPages > 1) {
      var pages = [];
      for (var i = 1; i <= this.props.totalPages; i++) {
        var page;
        if (i == this.props.currentPage) {
          page = <span>&nbsp;</span>;
        } else {
          page = <PaginatorLink pageNumber={i} onPaginatorLinkClick={this._handleOnClick} />;
        }
        pages.push (
          <li key={i}>
            {page}
          </li>
        )
      }
      return (
        <ul className="pagination">{pages}</ul>
      )
    } else {
      return (<div>&nbsp;</div>);
    };
  }
});

var PaginatorLink = React.createClass({
  displayName: 'PaginatorLink',
  _handleOnClick: function (e) {
    e.preventDefault();
    this.props.onPaginatorLinkClick(this.props.pageNumber);
  },
  render: function () {
    return (
      <a href="#" onClick={this._handleOnClick}>&nbsp;</a>
    );
  }
});

module.exports = Paginator;
