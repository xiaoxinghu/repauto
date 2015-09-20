var Gallery = require('../common').Gallery;

var Detail = React.createClass({
  getInitialState: function() {
    return {
      data: null
    };
  },

  componentDidMount: function() {
    PubSub.subscribe('selected', this.change);
  },

  change: function(msg, data) {
    this.setState({data: data});
  },

  render: function() {
    var testCase = (<div>Select Test Case from left.</div>);
    if (this.state.data != null) {
      var d = this.state.data;
      var tags = d.tags.map(function(t, i) {
        return (
          <span key={i} className="label label-default">{t}</span>
        )
      });
      var dList = [
        {icon: 'fa fa-tags', body: tags},
        {icon: 'fa fa-calendar', body: showDate(d.start)},
        {icon: 'fa fa-clock-o', body: showDuration(d.start, d.stop)}
      ];
      if (d.steps) {
        d.steps.forEach(function(step) {
          dList.push(
          {
            icon: 'fa fa-' + statusIcon(step.status),
            body: (
              <div key={_.uniqueId('step')}>
                <h5 className={"media-heading text-" + statusmap(step.status)}>{step.name}</h5>
                <p className="text-muted small">{showDuration(step.start, step.stop)}</p>
              </div>
            )
          });
        });
      }
      var content = dList.map(function(c) {
        return (
          <li key={_.uniqueId('item')} className="media">
            <div className="media-left">
              <i className={c.icon} />
            </div>
            <div className="media-body">
              {c.body}
            </div>
          </li>
        );
      });

      var images = d.attachments.map(function(att) {
        return {
          url: att.url,
          caption: (<div>{att.title}</div>)
        };
      });
      testCase = (
        <div>
          <div className="page-header">
            <h4>{d.name}</h4>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <ul className="media-list">
                {content}
              </ul>
            </div>
            <div className="col-sm-8">
              <Gallery images={images}/>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {testCase}
      </div>
    );
  }
});

module.exports = Detail;
