import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import StatusBadge from '../StatusBadge/StatusBadge';

@connect(
  state => ({
    total: state.run.data.all.length
  })
)
export default class Info extends Component {

  render() {
    const { total } = this.props;
    var sample = {
      passed: 'passed',
      failed: 'failed',
      broken: 'broken',
      pending: 'pending',
      pr: 'pass rate'
    }
    return (
      <div className="row">
        <div className="col-md-4">
          <strong>Showing {total} results.</strong>
        </div>
        <div className="col-md-8">
          <StatusBadge status={sample} />
          <span className="badge">todo</span>
          <p>Hold <em className="text-info">Ctrl</em> (<em className="text-info">⌘</em> on Mac) while clicking to select.</p>
        </div>
      </div>
    );
  }
};
