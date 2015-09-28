var Status = require('../common').Status;
var Progress = require('./Progress');
var HoverToShow = require('../common').HoverToShow;
var TestRunConstants = require('../../constants/TestRun');
var Actions = require('../../actions/TestRunActions');
var Store = require('../../stores/TestRunStore').store;
var PureRenderMixin = React.addons.PureRenderMixin;

var Row = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function() {
    return {
      selected: false
    };
  },
  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      this.setState({
        selected: Store.isSelected(this.props.id)
      });
    }
  },

  _handleClick: function(e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      Actions.select(this.props.id);
      this.setState({selected: Store.isSelected(this.props.id)});
    } else {
      window.location.href = Store.getById(this.props.id).url.detail;
    }
  },

  render: function() {
    var testRun = Store.getById(this.props.id);
    var start = moment(testRun.start);
    var stop = moment(testRun.stop);
    var duration = stop.diff(start, 'seconds').toHHMMSS();
    if (testRun.status != 'done') {
      var durationLabel = (
        <span className="label label-default">{testRun.status}</span>
      );
    }
    var status = testRun.summary || 'cannot get status';
    var content = [
      <div key={_.uniqueId('start')} className="cell">
        <strong>{showDateTime(testRun.start)}</strong>
      </div>,
      <div key={_.uniqueId('duration')} className="cell text-muted">
        {showDuration(testRun.start, testRun.stop)}
      </div>,
      <div key={_.uniqueId('type')} className="cell"><strong>{testRun.type}</strong></div>,
    ];
    if (this.props.params.action != 'bin') {
      content.push(
        <div key={_.uniqueId('status')} className="pull-right status-label">
          <label>P: </label>
          <Progress key={_.uniqueId('progress')} id={testRun.id} />
        </div>
      );
    }
    content.push(
      <div key={_.uniqueId('status')} className="pull-right status-label">
        <label>S: </label>
        <Status data={status} />
      </div>
    );
    var c = "list-group-item";
    if (this.state.selected) {
      c += " active"
    }
    return (
      <a href={testRun.url.detail} className={c} onClick={this._handleClick}>
        {content}
      </a>
    );
  }
});

module.exports = Row;
