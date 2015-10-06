var Gallery = require('../common').Gallery;
var CommentBox = require('../common').CommentBox;
var HistoryLine = require('./HistoryLine');
var Actions = require('../../actions/TestCaseActions');

var Detail = React.createClass({
  handleCommentSubmit: function(comment) {
    Actions.comment(this.props.id, comment);
  },

  render: function() {
    var testCase = (<div>Select Test Case from left.</div>);
    if (this.props.id) {
      var d = this.props.store.get(this.props.id);
    } else {
      var d = this.props.data;
    }
    if (d != null) {
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
            icon: getStatusMeta(step.status).icon,
            body: (
              <div key={_.uniqueId('step')}>
                <h5 className={"media-heading text-" + getStatusMeta(step.status).context}>{step.name}</h5>
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

      if (d.failure) {
        var stId = _.uniqueId('st');
        var error = (
          <div className={"alert alert-" + getStatusMeta(d.status).context + " fade in"} role="alert">
            <h4>{d.failure.message}</h4>
            <a href={"#" + stId} data-toggle="collapse" aria-expanded="false" aria-controls={stId}>show stack trace</a>
            <div className="collapse" id={stId}>
              {d.failure.stack_trace}
            </div>
          </div>
        );
      }
      if (this.props.compact) {
        container = ([
          <div key="content">
            <HistoryLine id={this.props.id} />
            <div>
              <ul className="media-list">
                {content}
              </ul>
            </div>
          </div>,
          <div key="gallery">
            <Gallery images={images}/>
          </div>
        ]);
      } else {
        var container = (
          <div className="row">
            <div className="col-md-4">
              <HistoryLine id={this.props.id} />
              <div>
                <ul className="media-list">
                  {content}
                </ul>
              </div>
              <CommentBox onCommentSubmit={this.handleCommentSubmit} comments={d.comments || []}/>
            </div>
            <div className="col-md-8">
              <Gallery images={images}/>
            </div>
          </div>
        );

      }
      testCase = (
        <div>
          <div className="page-header">
            <h4>{d.name}</h4>
          </div>
          <div>{error}</div>
          {container}
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
