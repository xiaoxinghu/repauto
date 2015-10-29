import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { fetchDetail, invalidate } from '../../modules/TestCase';
import { TestCaseListView, TestCaseMainView } from '../../components';

@connect(
  state => ({
    currentRun: state.router.params.runId
  }),
  {fetchDetail, invalidate}
)
export default class Detail extends Component {
  componentDidMount() {
    const { fetchDetail } = this.props;
    fetchDetail();
  }

  componentWillUnmount() {
    const { invalidate } = this.props;
    invalidate();
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-3">
          <TestCaseListView />
        </div>
        <div className="col-sm-9">
          <TestCaseMainView />
        </div>
      </div>
    );
  }
}
