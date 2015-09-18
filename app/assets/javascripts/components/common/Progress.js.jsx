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
    this.loadContent();
  },

  render: function() {
    var progress = [];
    var status = this.state.data.status
    var todo = this.state.data.todo
    if (status) {
      progress.push(<Status key={'pstatus-' + this.props.url} data={status} />);
    }
    if (todo) {
      progress.push(<span key={'todo-' + this.props.url} className="badge inline">{todo}</span>);
    }
    // if (this.state.data.hasOwnProperty('status')) {
    // }
    return (
      <div>{progress}</div>
    );
  }
});

module.exports = Progress;
