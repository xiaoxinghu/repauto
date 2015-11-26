import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import { fetchMatrix } from '../../modules/Project';
import Row from './Row';
import helper from '../../helper';
import _ from 'lodash';

export default class Matrix extends Component {
  handleClick(target) {
  }

  render() {
    const { data } = this.props;
    console.info('render matrix', data);
    let rows = 'loading';
    if (data) {
      rows = data.map((tcd) => {
        return (
          <Row label={tcd.name} data={tcd.history} />
        );
      });
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
};
