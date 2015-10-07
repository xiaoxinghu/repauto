var PureRenderMixin = React.addons.PureRenderMixin;
// var Map = require('immutable').Map;
var Immutable = require('immutable');
var Map = Immutable.Map;
var helper = require('../../helper');

var Status = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    data: React.PropTypes.any.isRequired,
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
    var orderedStatus = ['passed', 'failed', 'broken', 'pending', 'todo', 'pr'];
    var content = "";
    var data = this.props.data || this.state.data.toJS();
    if (typeof data === 'string') {
      content = (
        <div className="text-danger">{data}</div>
      );
    } else if (data instanceof Object) {
      content = orderedStatus.filter(function (status) {
        return data.hasOwnProperty(status);
      }).map(function (status) {
        var meta = helper.getStatusMeta(status);
        return (
          <span key={status} className={"label label-" + meta.context}>
            {data[status]}
          </span>
        )
      });
    }
    return (
      <div className="inline">
        {content}
      </div>
    );
  }
});

module.exports = Status;
