import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { fetch, mark, unmark } from '../../actions/run';
import { TestRunRow, TestRunToolbar, Stretchable, TestCaseDetail } from '../../components';
import _ from 'lodash';

@connect(
  state => ({
    main: state.testCase.data.all[state.testCase.spotlight.on],
    refresh: state.testCase.spotlight.refresh,
    diffWith: state.testCase.spotlight.diffWith
  }),
  {}
)
export default class MainView extends Component {

  render() {
    console.info('rendering main view', this.props.refresh);
    const { main, diffWith } = this.props;
    let panels = [];
    if (main) {
      panels.push(
        <TestCaseDetail key='main' data={main} history={main.history} />
      );
    }
    if (diffWith) {
      panels.push(
        <TestCaseDetail key='diffWith' data={diffWith} />
      );
    }
    const width = 'col-sm-' + (12 / panels.length).toString();
    const content = panels.map((p) => {
      return (
        <div className={width}>
          {p}
        </div>
      );
    });
    return (
      <Stretchable>
        <div className="row">
          {content}
        </div>
      </Stretchable>
    );
  }
};
