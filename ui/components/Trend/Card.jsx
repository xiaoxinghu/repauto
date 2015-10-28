import React, {Component, PropTypes} from 'react';
import TrendGraph from './Graph';
import _ from 'lodash';

export default class Card extends Component {
  render() {
    const {title, data} = this.props;
    var heading = [
      <h3 key='heading' className='panel-title pull-left'>
        {title}
      </h3>,
      <a key='search' href={this.props.url} className='btn btn-primary pull-right'>
        <i className='fa fa-search' />
      </a>
    ];
    var graph = (
      <TrendGraph data={data} />
    );
    var lastRun = (
      <h5 className='list-group-item-heading'>Last Run</h5>
    );
    return (
      <div className='panel panel-default'>
        <div className='panel-heading clearfix'>
          {heading}
        </div>
        <div className='list-group'>
          <div className='list-group-item'>
            {graph}
          </div>
          <div className='list-group-item'>
            {lastRun}
          </div>
        </div>
      </div>
    );
  }
};
