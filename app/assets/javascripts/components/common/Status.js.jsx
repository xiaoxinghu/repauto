var Status = React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    withPassRate: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      withPassRate: true
    };
  },

  render: function() {
    var orderedStatus = ['passed', 'failed', 'broken', 'pending'];
    var labels = "not enough data";
    var data = this.props.data
    if (data) {
      labels = orderedStatus.filter(function (status) {
        return data.hasOwnProperty(status);
      }).map(function (status) {
        return (
          <span key={status} className={"label label-" + statusmap(status)}>{data[status]}</span>
        )
      });

      if (this.props.withPassRate) {
        var passed = (data['passed'] === undefined) ? 0 : data['passed'];
        var total = 0;
        for (var k in data) {
          total += data[k];
        }
        var pr = Math.round(passed / total * 1000) / 10
        labels.push(<span key='pass_rate' className="label label-info">{pr.toString() + '%'}</span>);
      }
    };
    return (
      <div className="inline">
        {labels}
      </div>
    );
  }
});

module.exports = Status;
