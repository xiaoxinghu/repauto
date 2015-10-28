import React, {Component, PropTypes} from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import ClassNames from 'classnames';
import helper from '../../helper';

export default class TestRunRow extends Component {
  _handleClick(e) {
    e.preventDefault();
    this.props.onRowClick(e);
  }

  render() {
    const { run, marked } = this.props;
    var status = run.report.original_status || 'cannot get status';
    var pr = helper.getPassRate(status);
    status.pr = pr + '%';
    var content = [
      <div key='start' className='cell'>
        <strong>{helper.showDateTime(run.start)}</strong>
      </div>,
      <div key='duration' className='cell text-muted'>
        {helper.showDuration(run.start, run.stop)}
      </div>,
      <div key='name' className='cell'>
        <strong>{run.name}</strong>
      </div>,
    ];
    let trStatus = run.status;
    if (trStatus && trStatus != 'done') {
      content.push(
        <span key='trStatus' className="label label-default">{trStatus}</span>
      );
    }
    if (run.report.todo > 0) {
      content.push(
        <span key='todo' className="badge">{run.report.todo}</span>
      );
    }
    content.push(
      <div key='status' className="pull-right">
        <StatusBadge status={status} />
      </div>
    );
    return (
      <a href='#' className={ClassNames(
          'list-group-item',
          {'active': marked}
        )} onClick={this._handleClick.bind(this)}>
        {content}
      </a>
    );
  }
}

TestRunRow.PropTypes = {
  run: PropTypes.object.isRequired,
  marked: PropTypes.bool
}
