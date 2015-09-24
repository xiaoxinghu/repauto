var Comment = require('./Comment');

var CommentList = React.createClass({

  render: function() {
    var comments = this.props.comments.map(function(d) {
      return (
        <Comment name={d.name} status={d.status} comment={d.comment} time={d.time} />
      );
    });
    // if (_.isEmpty(comments)) {
    //   var content = (<p>No Comments</p>);
    // } else {
    //   var content = (
    //     <div>
    //       <ul className="media-list">
    //         {comments}
    //       </ul>
    //     </div>
    //   );
    // }
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
