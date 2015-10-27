import React, {Component, PropTypes} from 'react';
import helper from '../../helper';

export default class Comment extends Component {
  render() {
    return (
      <li className="media">
        <div className="media-left">
          <a href="#">
            <i className='fa fa-comment' />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            {this.props.name + ": " + this.props.status}
            <small>{helper.showDateTime(this.props.time)}</small>
          </h4>
          <p>{this.props.comment}</p>
        </div>
      </li>
    );
  }
};
