import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

export default class Donut extends Component {
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
      resize: true
    }
    new Morris.Donut(d);
  }

  _changeStyle(style) {
    this.setState({style: style});
    this._draw();
  }

  render() {
    this.graphId = _.uniqueId('donut');
    var style = {
      height: this.props.height,
      width: this.props.width
    };

    return (
      <div style={style}>
        <div id={this.graphId} />
      </div>
    );
  }
};
