import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { TestCaseDiffList, TestCaseMainView } from '../../components';
import { fetchDiff, invalidate } from '../../modules/TestCase';

@connect(
  state => ({
  }),
  {fetchDiff, invalidate}
)
export default class Diff extends Component {
  componentDidMount() {
    const { fetchDiff } = this.props;
    fetchDiff();
  }

  componentWillUnmount() {
    const { invalidate } = this.props;
    invalidate();
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-3">
          <TestCaseDiffList />
        </div>
        <div className="col-sm-9">
          <TestCaseMainView />
        </div>
      </div>
    );
  }
}
