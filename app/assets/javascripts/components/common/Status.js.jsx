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
    var orderedStatus = ['passed', 'failed', 'broken', 'pending', 'todo', 'pr'];
    var labels = "not enough data";
    var data = this.props.data;
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
      // labels = data.map(function(s) {
      //   return (
      //     <span key={_.uniqueId('status')} className={"label label-" + s}>{s.value}</span>
      //   )
      // });

      // if (this.props.withPassRate) {
      //   var passed = (data['passed'] === undefined) ? 0 : data['passed'];
      //   var total = 0;
      //   for (var k in data) {
      //     total += data[k];
      //   }
      //   var pr = Math.round(passed / total * 1000) / 10
      //   labels.push(<span key='pass_rate' className="label label-info">{pr.toString() + '%'}</span>);
      // }
    };
    return (
      <div className="inline">
        {labels}
      </div>
    );
  }
});

module.exports = Status;
