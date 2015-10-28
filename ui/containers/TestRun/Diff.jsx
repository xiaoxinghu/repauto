import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { TestCaseListView, TestCaseMainView } from '../../components';
import { fetch } from '../../actions/testCase';

@connect(
  state => ({
  }),
  {fetch}
)
export default class Diff extends Component {
  componentDidMount() {
    const { fetch, runs } = this.props;
    fetch();
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
