var React = require('react');
var GraphStyle = require('../../constants/Misc').GraphStyle;
var TrendGraph = require('./TrendGraph');
var Stretchable = require('../common').Stretchable;
var _ = require('lodash');

var Trend = React.createClass({
  getInitialState: function() {
    return {
      selected: '',
      data: {}
    };
  },

  _fetchData: function(type) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: this._gotData,
      data: {type: type},
      error: function(xhr, status, err) {
        console.error(_source, status, err.toString());
      }
    });
  },

  _gotData: function(data) {
    console.debug('got', data);
    this.setState({data: data});
  },

  _handleTypeChange: function(e) {
    this._fetchData(e.target.value);
    this.setState({selected: e.target.value});
  },

  render: function() {
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
          <TrendGraph data={this.state.data} height='400px' width='600px' />
        </div>
      </div>
    );
  }
});

module.exports = Trend;
