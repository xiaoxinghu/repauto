import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { fetch, mark, unmark } from '../../actions/run';
import { TestRunRow, TestRunToolbar } from '../../components';
import _ from 'lodash';

@connect(
  state => ({
    runs: state.run.data,
    path: state.router.location.pathname,
    marked: state.run.marked
  }),
  {pushState, fetch, mark, unmark}
)
export default class List extends Component {
  componentDidMount() {
    const { fetch, runs } = this.props;
    console.info('----- mount List', runs);
    fetch();
  }

  _handleRowClick(e, run) {
    if (e.ctrlKey || e.metaKey) {
    const { mark, unmark, marked } = this.props;
    if (marked.includes(run.id)) {
      unmark(run.id);
    } else {
      mark(run.id);
    }
    } else {
      const {pushState, path} = this.props;
      console.info('going to ', run.id);
      pushState(null, `${path}/${run.id}`);
    }
  }

  render() {
    const { runs, marked } = this.props;
    const data = runs || {all: []};
    const rows = data.all.map(function(tr) {
      return (
        <TestRunRow
          key={_.uniqueId('TEST_RUN_ROW')}
          run={tr}
          marked={marked.includes(tr.id)}
          onRowClick={(e) => this._handleRowClick(e, tr)} />
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
