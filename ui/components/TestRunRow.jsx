import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import StatusBadge from './StatusBadge';
import helper from '../helper';

export default class TestRunRow extends Component {
  render() {
    const { run } = this.props;
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
    content.push(
      <div key='status' className="pull-right">
        <StatusBadge status={status} />
      </div>
    );
    return (
      <Link to={`/projects/${run.projectId}/runs/${run.id}`} className='list-group-item'>
        {content}
      </Link>
    );
  }
}

TestRunRow.PropTypes = {
  run: PropTypes.object.isRequired,
  selected: PropTypes.bool
}
