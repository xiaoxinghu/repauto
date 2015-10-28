import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

export default class Collapsible extends Component {
  constructor(props){
    super(props);
    this.state = {height: 500};
  }

  render() {
    const {title, badge} = this.props;
    const gid = _.uniqueId('g');
    const lid = _.uniqueId('l');
    const style = {
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
          {title}
          <div className="pull-right">
            {badge}
          </div>
        </a>
        <div className="sublinks collapse" id={lid}>
          {this.props.children}
        </div>
      </div>
    );
  }
};
