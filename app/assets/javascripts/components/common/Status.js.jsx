var Status = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },

  render: function() {
    var orderedStatus = ['passed', 'failed', 'broken', 'pending'];
    var labels = "not enough data";
    summary = this.props.data
    if (summary) {
      labels = orderedStatus.filter(function (status) {
        return summary.hasOwnProperty(status);
      }).map(function (status) {
        return (
          <span key={status} className={"label label-" + statusmap(status)}>{summary[status]}</span>
        )
      })
      var passed = (summary['passed'] === undefined) ? 0 : summary['passed'];
      var total = 0;
      for (var k in summary) {
        total += summary[k];
      }
      var pr = Math.round(passed / total * 1000) / 10
      labels.push(<span key='pass_rate' className="label label-info">{pr}</span>);
    };
    return (
      <div className="inline">
        {labels}
      </div>
    );
  }
});

module.exports = Status;
