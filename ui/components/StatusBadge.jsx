import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import helper from '../helper';

export default class StatusBadge extends Component {
  render() {
    const orderedStatus = ['passed', 'failed', 'broken', 'pending', 'todo', 'pr'];
    var content = '';
    const { status } = this.props;
    if (typeof status === 'string') {
      content = (
        <div className="text-danger">{status}</div>
      );
    } else if (status instanceof Object) {
      content = orderedStatus.filter(function (s) {
        return status.hasOwnProperty(s);
      }).map(function (s) {
        var meta = helper.getStatusMeta(s);
        return (
          <span key={s} className={"label label-" + meta.context}>
            {status[s]}
          </span>
        )
      });
    }
    return (
      <div className="inline">
        {content}
      </div>
    );
  }
}

StatusBadge.PropTypes = {
  status: PropTypes.object.isRequired
}
