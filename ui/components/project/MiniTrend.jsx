var React = require('react');
var GraphStyle = require('../../constants/Misc').GraphStyle;
var TrendGraph = require('./TrendGraph');
var _ = require('lodash');

var MiniTrend = React.createClass({
  getInitialState: function() {
    return {
      data: {}
    };
  },

  componentDidMount: function() {
    this._fetchData();
  },

  _fetchData: function() {
    var fetchData = {type: this.props.runType};
    $.ajax({
      url: this.props.api,
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
    this.setState({data: data});
  },

  render: function() {
    var heading = [
      <h3 key='heading' className='panel-title pull-left'>
        {this.props.runType}
      </h3>,
      <a key='search' href={this.props.url} className='btn btn-primary pull-right'>
        <i className='fa fa-search' />
      </a>
    ];
    var graph = (
      <TrendGraph data={this.state.data} />
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
});

module.exports = MiniTrend;
