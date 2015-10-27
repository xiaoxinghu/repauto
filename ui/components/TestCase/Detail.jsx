import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import helper from '../../helper';
import { HistoryLine, CommentBox, Gallery } from '../index';
import { comment } from '../../actions/testCase';
import _ from 'lodash';


@connect(
  state => ({
    refresh: state.testCase.spotlight.refresh
  }),
  {comment}
)
export default class Detail extends Component {
  _handleCommentSubmit(content) {
    const {comment, data} = this.props;
    comment(data.id, content);
  }

  render() {
    const {data, history} = this.props;
    var testCase = (<div>Select Test Case from left.</div>);
    if (data != null) {
      var tags = data.tags.map(function(t, i) {
        return (
          <span key={i} className="label label-default">{t}</span>
        );
      });
      var dList = [
        {icon: 'fa fa-tags', body: tags},
        {icon: 'fa fa-calendar', body: helper.showDate(data.start)},
        {icon: 'fa fa-clock-o', body: helper.showDuration(data.start, data.stop)}
      ];
      if (data.steps) {
        data.steps.forEach(function(step) {
          dList.push(
          {
            icon: helper.getStatusMeta(step.status).icon,
            body: (
              <div key={_.uniqueId('step')}>
                <h5 className={"media-heading text-" + helper.getStatusMeta(step.status).context}>{step.name}</h5>
                <p className="text-muted small">{helper.showDuration(step.start, step.stop)}</p>
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

      var images = data.attachments.map(function(att) {
        return {
          url: att.url,
          caption: (<div>{att.title}</div>)
        };
      });

      if (data.failure) {
        var stId = _.uniqueId('st');
        var error = (
          <div className={"alert alert-" + helper.getStatusMeta(data.status).context + " fade in"} role="alert">
            <h4>{data.failure.message}</h4>
            <a href={"#" + stId} data-toggle="collapse" aria-expanded="false" aria-controls={stId}>show stack trace</a>
            <div className="collapse" id={stId}>
              {data.failure.stack_trace}
            </div>
          </div>
        );
      }
      var container = (
        <div className="row">
          <div className="col-lg-4">
            <HistoryLine history={history} />
            <div>
              <ul className="media-list">
                {content}
              </ul>
            </div>
            <CommentBox onCommentSubmit={(comment) => this._handleCommentSubmit(comment)} comments={data.comments || []}/>
          </div>
          <div className="col-lg-8">
            <Gallery images={images}/>
          </div>
        </div>
      );
      testCase = (
        <div>
          <div className="page-header">
            <h4>{data.name}</h4>
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
};
