import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { fetch, mark, unmark } from '../../actions/run';
import { TestRunRow, TestRunToolbar } from '../../components';
var _ = require('lodash');

@connect(
  state => ({
    runs: state.run.data,
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

  _handleRowClick(run) {
    const { mark, unmark, marked } = this.props;
    if (marked.includes(run.id)) {
      unmark(run.id);
    } else {
      mark(run.id);
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
