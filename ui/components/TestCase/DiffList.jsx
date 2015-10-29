import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { StatusBadge, SearchBar, RadioSet, Stretchable, Collapsible, TestCaseDiffRow } from '../../components';
import { spotlight } from '../../modules/TestCase';
import ClassNames from 'classnames';
import helper from '../../helper';
import _ from 'lodash';

@connect(
  state => ({
    all: state.testCase.data.all,
    selected: state.testCase.spotlight.on,
    processed: state.testCase.diffView.processed
  }),
  {spotlight}
)
export default class DiffList extends Component {
  _handleRowClick(id) {
    console.info('clicking', id);
    const {spotlight} = this.props;
    spotlight(id);
  }

  render() {
    const {all, processed, selected} = this.props;
    const rows = _.values(processed).map((data) => {
      return (
        <TestCaseDiffRow left={all[data.current]} right={all[data.prev]} onRowClick={this._handleRowClick.bind(this)} selected={selected} />
      )
    });
    const list = (
      <div className='list-group'>
        {rows}
      </div>
    );
    return (
      <div className="test-case-list">
        <div className='row'>
          <div className='col-sm-6'>Current</div>
          <div className='col-sm-6'>Previous</div>
        </div>
        <Stretchable>
          {list}
        </Stretchable>
      </div>
    );
  }
};
