import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { fetch } from '../../modules/TestCase';
import { TestCaseListView, TestCaseMainView } from '../../components';

@connect(
  state => ({
  }),
  {fetch}
)
export default class Detail extends Component {
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
