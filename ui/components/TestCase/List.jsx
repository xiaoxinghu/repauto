import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { StatusBadge, SearchBar, RadioSet, Stretchable, Collapsible, TestCaseRow } from '../../components';
import { fetchDetail, groupBy, filter, GROUP_BY, spotlight, SPOTLIGHT_MODE } from '../../modules/TestCase';
import ClassNames from 'classnames';
import helper from '../../helper';
import _ from 'lodash';

@connect(
  state => ({
    all: state.testCase.data.all,
    selected: state.testCase.spotlight.on,
    selectedGroupBy: state.testCase.listView.groupBy,
    processed: state.testCase.listView.processed
  }),
  {fetchDetail, groupBy, filter, spotlight}
)
export default class TestCaseList extends Component {
  componentDidMount() {
    const { fetchDetail } = this.props;
    fetchDetail();
  }

  _handleSearch(text) {
    this.props.filter(text);
  }

  _handleGroupByChange(selected) {
    this.props.groupBy(selected);
  }

  _handleRowClick(id) {
    const {spotlight} = this.props;
    spotlight(id);
  }

  _generateList(data) {
    const {selected} = this.props;
    return data.map(function (testCase, i) {
      return (
        <TestCaseRow
          key={_.uniqueId('tcr')}
          data={testCase}
          selected={selected == testCase.id}
          onRowClick={() => this._handleRowClick(testCase.id)} />
      );
    }, this);
  }

  _getSummary(data) {
    var summary = {};
    data.forEach(function(c) {
      if (!summary[c.status]) {
        summary[c.status] = 0;
      }
      summary[c.status] += 1;
    });
    return summary;
  }

  _handleGroupClick(ids) {
    const { selectedGroupBy, spotlight } = this.props;
    if (selectedGroupBy == GROUP_BY.GRID) {
      spotlight(ids, SPOTLIGHT_MODE.GRID);
    }
  }

  render() {
    const {processed, all, selectedGroupBy} = this.props;
    let index = 0;
    const list = _.keys(processed).map((group) => {
      const data = processed[group].map((d) => all[d]);
      const badge = (
        <StatusBadge status={this._getSummary(data)} />
      );
      return (
        <Collapsible
          key={"group_" + index++}
          title={group}
          badge={badge} onClick={() => this._handleGroupClick(processed[group])}>
          {this._generateList(data)}
        </Collapsible>
      );
    }, this);
    const radios = [
      {label: (<i className="fa fa-star" />), value: GROUP_BY.FEATURE},
      {label: (<i className="fa fa-exclamation-triangle" />), value: GROUP_BY.ERROR},
      {label: (<i className="glyphicon glyphicon-th" />), value: GROUP_BY.GRID},
      {label: (<i className="fa fa-check-square-o" />), value: GROUP_BY.TODO},
      {label: (<i className="fa fa-refresh" />), value: GROUP_BY.RERUN}
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
