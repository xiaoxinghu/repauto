import React, {Component, PropTypes} from 'react';
import Comment from './Comment';
import _ from'lodash';

export default class CommentList extends Component {

  render() {
    var comments = this.props.comments.map(function(d) {
      return (
        <Comment key={_.uniqueId('comment')} name={d.user} status={d.status} comment={d.comment} time={d.time} />
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
};
