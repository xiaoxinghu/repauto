import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import helper from '../../helper';
import _ from 'lodash';

export default class DiffRow extends Component {
  _handleClick(e, id) {
    e.preventDefault();
    this.props.onRowClick(id);
  }

  _genContent(data) {
    const {selected} = this.props;
    let content = 'X';
    let context = 'muted';
    let disabled = true;
    let id;
    if (data && data.name) {
      content = data.name;
      context = helper.getStatusMeta(data.status).context;
      disabled = false;
      id = data.id;
    }
    const style = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    return (
      <div className='btn-group' role='group'>
        <button type='button'
          className={ClassNames(
            'btn',
            'btn-' + context,
            {'active': selected == id}
          )} style={style} disabled={disabled}
          onClick={(e) => this._handleClick(e, id)}>
          {content}
        </button>
      </div>
    )
  }

  render() {
    var { left, right, selected } = this.props;
    const display = (
      <div className='btn-group btn-group-justified' role='group' aria-label='...'>
        {this._genContent(left)}
        {this._genContent(right)}
      </div>
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
          'small'
        )}>
        {display}
      </a>
    );
  }
};
