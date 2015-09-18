var Status = require('../common').Status;
var Progress = require('../common').Progress;

var Row = React.createClass({
  handleClick: function(e) {
    window.location.href = this.props.data.url;
  },
  render: function() {
    var testRun = this.props.data;
    var start = moment(testRun.start);
    var stop = moment(testRun.stop);
    var duration = stop.diff(start, 'seconds').toHHMMSS();
    return (
      <tr>
        <td>
          <input type="checkbox"></input>
        </td>
        <td onClick={this.handleClick}>{testRun.type}</td>
        <td onClick={this.handleClick}>{start.format("YYYY-MM-DD HH:mm:SS")}</td>
        <td onClick={this.handleClick}>{duration}</td>
        <td onClick={this.handleClick}>
          <Status key={'status-' + testRun.id} data={testRun.summary} />
        </td>
        <td onClick={this.handleClick}><Progress key={'progress-' + testRun.id} url={testRun.progress_url} /></td>
      </tr>
    );
  }
});

module.exports = Row;
