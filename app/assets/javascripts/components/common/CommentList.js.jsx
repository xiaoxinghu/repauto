var Comment = require('./Comment');

var CommentList = React.createClass({

  render: function() {
    var comments = this.props.comments.map(function(d) {
      return (
        <Comment name={d.user} status={d.status} comment={d.comment} time={d.time} />
      );
    });
    return (
      <div>
        <ul className="media-list">
          {comments}
        </ul>
      </div>
    );
  }
});

module.exports = CommentList;
