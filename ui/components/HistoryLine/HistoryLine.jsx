import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import helper from '../../helper';
import _ from 'lodash';

export default class HistroyLine extends Component {
  handleClick(target) {
    this.props.onClick(target);
  }

  render() {
    const { history } = this.props;
    if (!_.isEmpty(history)) {
      var hist = history.map(function(testCase) {
        var status = helper.getStatusMeta(testCase.status);
        var className = 'btn btn-' + status.context;
        return (
          <button key={_.uniqueId('hist')} type='button' className={className} onClick={this.handleClick.bind(this, testCase)}>
            <i className={status.icon} />
          </button>
        );
      }, this);
    }
    return (
      <div className='btn-group btn-group-sm'>
        {hist}
      </div>
    );
  }
};
