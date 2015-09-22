var Status = require('../common').Status;
var HoverToShow = require('../common').HoverToShow;
var TestRunConstants = require('../../constants/TestRun');
var Actions = require('../../actions/TestRunActions');

var Row = React.createClass({

  handleClick: function(e) {
    window.location.href = this.props.data.url.detail;
  },

  handleRowSelection: function(e) {
    if (e.target.checked) {
      Actions.select(this.props.data.id);
    } else {
      Actions.unselect(this.props.data.id);
    }
    // console.log(this.props.data.id, e.target.checked);
  },

  render: function() {
    var testRun = this.props.data;
    var start = moment(testRun.start);
    var stop = moment(testRun.stop);
    var duration = stop.diff(start, 'seconds').toHHMMSS();
    var status = testRun.summary;
    var progress = testRun.progress;
    status['pr'] = getPassRate(status);
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
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>{start.format("YYYY-MM-DD HH:mm:SS")}</td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>{duration}</td>,
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
    return (
      <tr className="hover-master">
        {cells}
      </tr>
    );
  }
});

module.exports = Row;
