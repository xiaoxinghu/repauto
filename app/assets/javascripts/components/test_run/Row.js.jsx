var Status = require('../common').Status;
var Progress = require('../common').Progress;
var HoverToShow = require('../common').HoverToShow;
var TestRunConstants = require('../../constants/TestRun');
var Actions = require('../../actions/TestRunActions');

var Row = React.createClass({

  handleClick: function(e) {
    window.location.href = this.props.data.url.detail;
  },

  handleButtonClick: function(link) {
    $.ajax({
      url: link,
      dataType: 'json',
      cache: false,
      success: function(data) {
        Actions.remove(this.props.data.id);
        // PubSub.publish(TestRunConstants.REMOVE, this.props.data.id);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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
    if (testRun.url.restore) {
      var button = (
        <a href="#" className="hover-to-show" onClick={this.handleButtonClick.bind(this, testRun.url.restore)}>
          <i className="fa fa-facebook" />
        </a>
      );
    } else if (testRun.url.archive) {
      var button = (
        <a href="#" className="hover-to-show" onClick={this.handleButtonClick.bind(this, testRun.url.archive)}>
          <i className="fa fa-trash-o" />
        </a>
      );
    }
    var cells = ([
      <td key={_.uniqueId('cell')}>
        <input type="checkbox" onChange={this.handleRowSelection}></input>
      </td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>{testRun.type}</td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>{start.format("YYYY-MM-DD HH:mm:SS")}</td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>{duration}</td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}>
        <Status key={'status-' + testRun.id} data={testRun.summary} />
      </td>,
      <td key={_.uniqueId('cell')} onClick={this.handleClick}><Progress key={'progress-' + testRun.id} url={testRun.url.progress} /></td>,
      <td key={_.uniqueId('cell')}>
        {button}
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
