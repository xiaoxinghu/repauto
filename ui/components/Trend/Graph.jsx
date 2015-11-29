import React, {Component, PropTypes} from 'react';
import RadioSet from '../RadioSet/RadioSet';
import _ from 'lodash';

const STYLE = {
  LINE: 'LINE',
  AREA: 'AREA'
};

const MODE = {
  VALUE: 'VALUE',
  PERCENTAGE: 'PERCENTAGE'
};

export default class Graph extends Component {
  constructor(props){
    super(props);
    this.state = {style: STYLE.AREA, mode: MODE.VALUE};
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
    const data = this._process(this.props.data, this.state.mode);
    var target = $('#' + this.graphId);
    target.empty();
    var d = {
      element: target,
      data: data,
      xkey: 'time',
      ykeys: ['passed', 'failed', 'broken', 'pending'],
      labels: ['passed', 'failed', 'broken', 'pending'],
      lineColors: ['#5cb85c', '#d9534f', '#f0ad4e', 'gray'],
      hideHover: 'auto',
      smooth: false
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

  _process(data, mode) {
    if (mode == MODE.VALUE) {
      return data;
    }
    const processed = data.map((d) => {
      const total = _.sum(d);
      return _.mapValues(d, (n, k) => {
        if (k == 'time') {
          return n;
        } else {
          return n / total;
        }
      });
    });
    console.info("data", data);
    console.info("processed", processed);
    return processed;
  }

  _changeStyle(style) {
    this.setState({style: style});
    this._draw();
  }

  _changeMode(mode) {
    this.setState({mode: mode});
    this._draw();
  }

  render() {
    this.graphId = _.uniqueId('morrisTarget');
    const radios = [
      {label: (<i className="fa fa-area-chart" />), value: STYLE.AREA},
      {label: (<i className="fa fa-line-chart" />), value: STYLE.LINE}
    ];
    const modeRadios = [
      {label: (<i className="fa fa-hashtag" />), value: MODE.VALUE},
      {label: (<i className="fa fa-percent" />), value: MODE.PERCENTAGE}
    ];
    var style = {
      height: this.props.height,
      width: this.props.width
    };

    return (
      <div>
        <RadioSet group="view" onChange={this._changeStyle.bind(this)} radios={radios} selected={this.state.style} />
        <RadioSet group="mode" onChange={this._changeMode.bind(this)} radios={modeRadios} selected={this.state.mode} />
        <div id={this.graphId} />
      </div>
    );
  }
};
