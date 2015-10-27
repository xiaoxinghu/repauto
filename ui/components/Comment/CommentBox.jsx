import React, {Component, PropTypes} from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

export default class CommentBox extends Component {

  _handleCommentSubmit(comment) {
    this.props.onCommentSubmit(comment);
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <CommentList comments={this.props.comments}/>
        </div>
        <div className="panel-footer">
          <CommentForm onCommentSubmit={this.props.onCommentSubmit}/>
        </div>
      </div>
    );
  }
};
