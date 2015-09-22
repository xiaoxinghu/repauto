var Status = require('./Status');
var Progress = React.createClass({
  propTypes: {
    url: React.PropTypes.string
  },

  loadContent: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: {}};
  },
  componentDidMount: function() {
    // this.loadContent();
  },

  render: function() {
    var progress = [];
    var status = this.props.data.status;
    var todo = this.props.data.todo;
    if (todo) {
      status['todo'] = todo;
    }
    if (status) {
      progress.push(<Status key={'pstatus-' + this.props.url} data={status} />);
    }
    return (
      <div>{progress}</div>
    );
  }
});

module.exports = Progress;
