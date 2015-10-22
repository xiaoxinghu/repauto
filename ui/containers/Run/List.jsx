import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { fetchTestRuns } from '../../redux/modules/run'
import { TestRunRow } from '../../components';
var _ = require('lodash');

@connect(
  state => ({
    runs: state.run.all,
    projectId: state.router.params.projectId
  })
)
export default class List extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTestRuns());
  }
  render() {
    const { runs, projectId } = this.props;
    const rows = runs.map(function(tr) {
      tr.projectId = projectId;
      return (
        <TestRunRow key={_.uniqueId('TEST_RUN_ROW')} run={tr} />
      );
      // return (<h1>{tr.type}-{tr.start}</h1>);
    });
    return (
      <div>
        Test Run List
        <div className='list-group'>
          {rows}
        </div>
      </div>
    );
  }
}
