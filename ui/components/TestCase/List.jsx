import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import StatusBadge from '../StatusBadge/StatusBadge';
import { SearchBar, RadioSet, Stretchable } from '../../components';
import Group from './Group';
import { fetch, groupBy, filter, GROUP_BY } from '../../actions/testCase';
import ClassNames from 'classnames';
import helper from '../../helper';
import _ from 'lodash';

@connect(
  state => ({
    all: state.testCase.data.all,
    selectedGroupBy: state.testCase.listView.groupBy,
    processed: state.testCase.listView.processed
  }),
  {fetch, groupBy, filter}
)
export default class TestCaseList extends Component {
  _handleSearch(text) {
    this.props.filter(text);
  }

  _handleGroupByChange(selected) {
    this.props.groupBy(selected);
  }

  render() {
    const {processed, all, selectedGroupBy} = this.props;
    const list = _.keys(processed).map((group) => {
      return (
        <Group key={_.uniqueId('group')} name={group} data={processed[group].map((d) => all[d])} />
      );
    });
    const radios = [
      {label: (<i className="fa fa-star" />), value: GROUP_BY.FEATURE},
      {label: (<i className="fa fa-exclamation-triangle" />), value: GROUP_BY.ERROR},
      {label: (<i className="glyphicon glyphicon-th" />), value: GROUP_BY.GRID},
      {label: (<i className="fa fa-check-square-o" />), value: GROUP_BY.TODO}
    ];
    return (
      <div className="test-case-list">
        <SearchBar onUserInput={(keyword) => this._handleSearch(keyword)}/>
        <RadioSet group="view" onChange={(selected) => this._handleGroupByChange(selected)} radios={radios} selected={selectedGroupBy} />
        <Stretchable>
          {list}
        </Stretchable>
      </div>
    );
  }
};
