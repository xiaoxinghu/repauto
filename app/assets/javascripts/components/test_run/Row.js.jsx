var Status = require('../common').Status;
var HoverToShow = require('../common').HoverToShow;
var TestRunConstants = require('../../constants/TestRun');
var Actions = require('../../actions/TestRunActions');

var Row = React.createClass({

  _handleClick: function(e) {
    e.preventDefault();
    this.props.onClick(e, this.props.data.id);
  },

  handleRowSelection: function(e) {
    if (e.target.checked) {
      Actions.select(this.props.data.id);
    } else {
      Actions.unselect(this.props.data.id);
    }
  },

  extractStatus: function(testRun) {
    var status = testRun.summary || {};
    if (!_.isEmpty(status)) {
      status['pr'] = getPassRate(status).toString() + '%';
    }
    return status;
  },

  render: function() {
    var testRun = this.props.data;
    var start = moment(testRun.start);
    var stop = moment(testRun.stop);
    var duration = stop.diff(start, 'seconds').toHHMMSS();
    if (testRun.status != 'done') {
      var durationLabel = (
        <span className="label label-default">{testRun.status}</span>
      );
    }
    var status = testRun.summary;
    var progress = testRun.progress;
    if (this.props.selected) {
      var checkbox = (<input type="checkbox" checked onChange={this.handleRowSelection}></input>);
    } else {
      var checkbox = (<input type="checkbox" onChange={this.handleRowSelection}></input>);
    }
    var cells = ([
      <td key={_.uniqueId('cell')}>
        {checkbox}
      </td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>{testRun.type}</td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>{showDateTime(start)}</td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>
        {duration}
        {durationLabel}
      </td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>
        <Status data={status} />
      </td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>
        <Status data={progress} />
      </td>,
      <td key={_.uniqueId('cell')}>
        <a href="#" className="hover-to-show" onClick={function() {Actions.remove(testRun.id)}}>
          <i className="fa fa-trash-o" />
        </a>
      </td>
    ]);
    // return (
    //   <tr className="hover-master">
    //     {cells}
    //   </tr>
    // );
    var content = [
      <div key={_.uniqueId('start')} className="cell">
        <strong>{showDateTime(testRun.start)}</strong>
      </div>,
      <div key={_.uniqueId('duration')} className="cell text-muted">
        {showDuration(testRun.start, testRun.stop)}
      </div>,
      <div key={_.uniqueId('type')} className="cell">{testRun.type}</div>,
      <Status key={_.uniqueId('status')} data={status} />,
      <Status key={_.uniqueId('progress')} data={progress} />
    ];
    var c = "list-group-item";
    if (this.props.selected) {
      c += " active"
    }
    return (
      <a href={this.props.data.url.detail} className={c} onClick={this._handleClick}>
        {content}
      </a>
    );
  }
});

module.exports = Row;
