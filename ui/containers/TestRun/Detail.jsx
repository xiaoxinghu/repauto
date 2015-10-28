import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { TestCaseListView, TestCaseMainView } from '../../components';

export default class Detail extends Component {
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
