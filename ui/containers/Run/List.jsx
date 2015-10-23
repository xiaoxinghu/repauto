import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { fetchTestRuns, selectTestRun, unSelectTestRun } from '../../redux/modules/run'
import { TestRunRow, TestRunToolbar } from '../../components';
var _ = require('lodash');

@connect(
  state => ({
    runs: state.run.all,
    project: state.project.active,
    selected: state.run.selected
  }),
  {pushState, fetchTestRuns, selectTestRun, unSelectTestRun}
)
export default class List extends Component {
  componentDidMount() {
    const { fetchTestRuns } = this.props;
    fetchTestRuns();
  }

  _handleRowClick(run) {
    const { selectTestRun, unSelectTestRun, selected } = this.props;
    if (selected.includes(run.id)) {
      unSelectTestRun(run.id);
    } else {
      selectTestRun(run.id);
    }
    // const { pushState, project } = this.props;
    // pushState(null, `/projects/${project.id}/runs/${run.id}`);
  }

  render() {
    const { runs, selected } = this.props;
    const rows = runs.map(function(tr) {
      return (
        <TestRunRow
          key={_.uniqueId('TEST_RUN_ROW')}
          run={tr}
          selected={selected.includes(tr.id)}
          onRowClick={() => this._handleRowClick(tr)} />
      );
    }, this);
    return (
      <div>
        <TestRunToolbar />
        <div className='list-group'>
          {rows}
        </div>
      </div>
    );
  }
}
