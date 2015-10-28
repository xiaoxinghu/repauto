import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import StatusBadge from '../StatusBadge/StatusBadge';
import Row from './Row';
import { spotlight } from '../../modules/TestCase';
import _ from 'lodash';

@connect(
  state => ({
    selected: state.testCase.spotlight.on
  }),
  {spotlight}
)
export default class Group extends Component {
  _handleRowClick(id) {
    const {spotlight} = this.props;
    spotlight(id);
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

  render() {
    const {name, data, selected} = this.props;
    var testCaseRows = data.map(function (testCase, i) {
      return (
        <Row
          key={_.uniqueId('tcr')}
          data={testCase}
          selected={selected == testCase.id}
          onRowClick={() => this._handleRowClick(testCase.id)} />
      );
    }, this);
    var gid = _.uniqueId('g');
    var lid = _.uniqueId('l');
    var style = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    return (
      <div id={gid}>
        <a className="list-group-item"
          style={style}
          data-toggle="collapse"
          data-target={'#' + lid}
          data-parent={'#' + gid}>
          {name}
          <div className="pull-right">
            <StatusBadge status={this._getSummary(data)} />
          </div>
        </a>
        <div className="sublinks collapse" id={lid}>
          {testCaseRows}
        </div>
      </div>
    );
  }
};
