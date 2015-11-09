import React, {Component, PropTypes} from 'react';
import RadioSet from '../RadioSet/RadioSet';
import _ from 'lodash';

const STYLE = {
  LINE: 'LINE',
  AREA: 'AREA'
};

export default class Graph extends Component {
  constructor(props){
    super(props);
    this.state = {style: STYLE.AREA};
  }

  componentDidUpdate() {
    this._draw();
  }

  componentDidMount() {
    this._draw();
    window.addEventListener('resize', this._draw.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._draw.bind(this));
  }

  _draw() {
    if (_.isEmpty(this.props.data)) {
      return;
    }
    var target = $('#' + this.graphId);
    target.empty();
    var d = {
      element: target,
      data: this.props.data,
      xkey: 'time',
      ykeys: ['passed', 'failed', 'broken', 'pending'],
      labels: ['passed', 'failed', 'broken', 'pending'],
      lineColors: ['#5cb85c', '#d9534f', '#f0ad4e', 'gray'],
      hideHover: 'auto'
    };
    switch (this.state.style) {
      case STYLE.LINE:
        new Morris.Line(d);
        break;
      case STYLE.AREA:
        new Morris.Area(d);
        break;
      default:
    }
  }

  _changeStyle(style) {
    this.setState({style: style});
    this._draw();
  }

  render() {
    this.graphId = _.uniqueId('morrisTarget');
    const radios = [
      {label: (<i className="fa fa-area-chart" />), value: STYLE.AREA},
      {label: (<i className="fa fa-line-chart" />), value: STYLE.LINE}
    ];
    var style = {
      height: this.props.height,
      width: this.props.width
    };

    return (
      <div>
        <RadioSet group="view" onChange={this._changeStyle.bind(this)} radios={radios} selected={this.state.style} />
        <div id={this.graphId} />
      </div>
    );
  }
};
