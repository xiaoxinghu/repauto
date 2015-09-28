var PureRenderMixin = React.addons.PureRenderMixin;
// var Map = require('immutable').Map;
var Immutable = require('immutable');
var Map = Immutable.Map;

var Status = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    data: React.PropTypes.object,
    withPassRate: React.PropTypes.bool,
    url: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      data: Map({})
    };
  },

  getDefaultProps: function() {
    return {
      withPassRate: true,
      pollInterval: 10000
    };
  },

  _fetchStatus: function() {
    if (!this.isMounted()) {return;}
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (this.isMounted()) {
          var d = Immutable.fromJS(data);
          if (!Immutable.is(d, this.state.data)) {
            this.setState({data: d});
          }
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(TestRun.url.progress, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    if (this.props.url) {
      this._fetchStatus();
      setInterval(this._fetchStatus, this.props.pollInterval);
    }
  },

  render: function() {
    console.debug('rendering status');
    var orderedStatus = ['passed', 'failed', 'broken', 'pending', 'todo', 'pr'];
    var labels = "not enough data";
    var data = this.props.data || this.state.data.toJS();
    if (data) {
      labels = orderedStatus.filter(function (status) {
        return data.hasOwnProperty(status);
      }).map(function (status) {
        var meta = getStatusMeta(status);
        return (
          <span key={status} className={"label label-" + meta.context}>
            <i className={meta.icon}></i>
            {data[status]}
          </span>
        )
      });
    };
    return (
      <div className="inline">
        {labels}
      </div>
    );
  }
});

module.exports = Status;
