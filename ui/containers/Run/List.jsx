import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { fetch, mark, unmark } from '../../actions/run';
import { TestRunRow, TestRunToolbar } from '../../components';
var _ = require('lodash');

@connect(
  state => ({
    runs: state.run.all,
    project: state.project.active,
    marked: state.run.marked
  }),
  {pushState, fetch, mark, unmark}
)
export default class List extends Component {
  componentDidMount() {
    const { fetch } = this.props;
    fetch();
  }

  _handleRowClick(run) {
    const { mark, unmark, marked } = this.props;
    if (marked.includes(run.id)) {
      unmark(run.id);
    } else {
      mark(run.id);
    }
    // const { pushState, project } = this.props;
    // pushState(null, `/projects/${project.id}/runs/${run.id}`);
  }

  render() {
    const { runs, marked } = this.props;
    const rows = runs.map(function(tr) {
      return (
        <TestRunRow
          key={_.uniqueId('TEST_RUN_ROW')}
          run={tr}
          marked={marked.includes(tr.id)}
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
