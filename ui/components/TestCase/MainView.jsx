import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { SPOTLIGHT_MODE } from '../../modules/TestCase';
import { TestRunRow, TestRunToolbar, Stretchable, TestCaseDetail, TestCaseGrid } from '../../components';
import _ from 'lodash';

@connect(
  state => ({
    spotlight: state.testCase.spotlight.on.map((id) => state.testCase.data.all[id]),
    diffWith: state.testCase.spotlight.diffWith,
    mode: state.testCase.spotlight.mode
  }),
  {}
)
export default class MainView extends Component {

  render() {
    const { spotlight, diffWith, mode } = this.props;
    if (mode == SPOTLIGHT_MODE.DETAIL) {
      let panels = [];
      const main = spotlight[0];
      if (main) {
        panels.push(
          <TestCaseDetail data={main} history={main.history} />
        );
      }
      if (diffWith) {
        panels.push(
          <TestCaseDetail data={diffWith} />
        );
      }
      const width = 'col-sm-' + (12 / panels.length).toString();
      var content = panels.map((p) => {
        return (
          <div key={_.uniqueId('detail')} className={width}>
            {p}
          </div>
        );
      });
    } else if (mode == SPOTLIGHT_MODE.GRID) {
      var content = (
        <TestCaseGrid data={spotlight} />
      );
    }
    return (
      <Stretchable>
        <div className="row">
          {content}
        </div>
      </Stretchable>
    );
  }
};
