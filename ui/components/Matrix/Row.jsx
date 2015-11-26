import React, {Component, PropTypes} from 'react';
import ClassNames from 'classnames';
import helper from '../../helper';
import _ from 'lodash';

export default class Row extends Component {
  constructor(props){
    super(props);
    this.state = {bg: '#fff'};
  }

  handleClick(target) {
  }

  render() {
    const { label, data } = this.props;
    const cells = data.map((d) => {
      var status = helper.getStatusMeta(d.status);
      var className = 'btn btn-' + status.context;
      return (
        <button key={_.uniqueId('matrix_row')} type='button' className={className} onClick={this.handleClick.bind(this, d)}>
          <span className={status.icon + ' statusIcon'} />
        </button>
      );
    });
    var style = {
      display: 'inline-block',
      verticalAlign: 'middle',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
    var rowStyle = {
      backgroundColor: this.state.bg
    };
    return (
      <div className="row" style={rowStyle}
        onMouseEnter={(e) => this.setState({bg: '#e1e1e8'})}
        onMouseLeave={(e) => this.setState({bg: '#fff'})} >
        <div className="col-md-6" style={style}>
          <strong>{label}</strong>
        </div>
        <div className="col-md-6">
          <div className='btn-group btn-group-sm'>
            {cells}
          </div>
        </div>
      </div>
    );
  }
};
