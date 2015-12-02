import React, {Component, PropTypes} from 'react';
import ClassNames from 'classnames';
import helper from '../../helper';
import _ from 'lodash';

export default class Row extends Component {
  _handleClick(e) {
    e.preventDefault();
    this.props.onRowClick();
  }

  render() {
    var { data, selected } = this.props;
    var display = [];
    if (data.comments && data.comments.length > 0) {
      display.push(
        <i key="icon" className="fa fa-comment" />
      );
    }
    if (data.rerun > 0) {
      display.push(
        <i key="icon" className="fa fa-refresh" />
      );
    }
    display.push(
      data.name
    );
    var style = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    return (
      <a href='#'
        style={style}
        className={ClassNames(
          'list-group-item',
          'small',
          'list-group-item-' + helper.getStatusMeta(data.status).context,
          {'active': selected}
        )} onClick={this._handleClick.bind(this)}>
        {display}
      </a>
    );
  }
};
