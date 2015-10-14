var React = require('react');
var GraphStyle = require('../../constants/Misc').GraphStyle;
var _ = require('lodash');

var Trend = React.createClass({
  getInitialState: function() {
    return {
      selected: '',
      data: {},
      style: GraphStyle.AREA
    };
  },


  _handleTypeChange: function(e) {
    this.setState({selected: e.target.value});
    var fetchData = {
      type: e.target.value
    };
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: this._gotData,
      data: fetchData,
      error: function(xhr, status, err) {
        console.error(_source, status, err.toString());
      }
    });
  },

  _gotData: function(data) {
    console.log(data);
    var target = $('#morrisGraph');
    target.empty();
    var d = {
      element: target,
      data: data,
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

  render: function() {
    console.log(this.state.selected);
    var types = this.props.types.map(function(t) {
      return (
        <option key={_.uniqueId('type')} value={t}>{t}</option>
      )
    });
    var panel = (
      <div>
        <select className="form-control" onChange={this._handleTypeChange} value={this.state.selected}>
          <option key={_.uniqueId('type')} value=''>Select Run</option>
          {types}
        </select>
      </div>
    );
    return (
      <div className='row'>
        <div className='col-sm-3'>
          {panel}
        </div>
        <div className='col-sm-9'>
          <div id='morrisGraph' />
        </div>
      </div>
    );
  }
});

module.exports = Trend;
