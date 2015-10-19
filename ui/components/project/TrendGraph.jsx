var React = require('react');
var GraphStyle = require('../../constants/Misc').GraphStyle;
var RadioSet = require('../common').RadioSet;
var _ = require('lodash');

var TrendGraph = React.createClass({
  getInitialState: function() {
    return {
      style: GraphStyle.LINE
    };
  },

  componentDidUpdate: function() {
    this._draw();
  },

  componentDidMount: function() {
    window.addEventListener('resize', this._draw);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this._draw);
  },

  _draw: function() {
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
    }
    switch (this.state.style) {
      case GraphStyle.LINE:
        new Morris.Line(d);
        break;
      case GraphStyle.AREA:
        new Morris.Area(d);
        break;
      default:
    }
  },

  _changeStyle: function(style) {
    this.setState({style: style});
    this._draw();
  },

  render: function() {
    this.graphId = _.uniqueId('morrisTarget');
    var radios = [
      {label: (<i className="fa fa-line-chart" />), value: GraphStyle.LINE},
      {label: (<i className="fa fa-area-chart" />), value: GraphStyle.AREA}
    ];
    var style = {
      height: this.props.height,
      width: this.props.width
    };

    return (
      <div>
        <RadioSet group="view" onChange={this._changeStyle} radios={radios} selected={this.state.style} />
        <div id={this.graphId} />
      </div>
    );
  }
});

module.exports = TrendGraph;
