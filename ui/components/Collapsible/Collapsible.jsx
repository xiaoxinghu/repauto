import React, {Component, PropTypes} from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import _ from 'lodash';

export default class Collapsible extends Component {
  constructor(props){
    super(props);
    this.state = {height: 500};
  }

  _handleClick() {
    this.props.onClick();
  }

  render() {
    const {title, badge} = this.props;
    const gid = _.uniqueId('g');
    const lid = _.uniqueId('l');
    const tid = _.uniqueId('t');
    const style = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    const tooltip = (
      <Tooltip id={tid}>{title}</Tooltip>
    );
    return (
      <div id={gid}>
        <OverlayTrigger placement='right' overlay={tooltip}>
          <a className="list-group-item"
            style={style}
            data-toggle="collapse"
            data-target={'#' + lid}
            data-parent={'#' + gid}
            onClick={this._handleClick.bind(this)}>
            {title}
            <div className="pull-right">
              {badge}
            </div>
          </a>
        </OverlayTrigger>
        <div className="sublinks collapse" id={lid}>
          {this.props.children}
        </div>
      </div>
    );
  }
};
