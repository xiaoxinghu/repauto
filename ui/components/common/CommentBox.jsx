var React = require('react');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({

  handleCommentSubmit: function(comment) {
    this.props.onCommentSubmit(comment);
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <CommentList comments={this.props.comments}/>
        </div>
        <div className="panel-footer">
          <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        </div>
      </div>
    );
  }
});

module.exports = CommentBox;
