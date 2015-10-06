var RadioSet = require('./RadioSet');
var CommentForm = React.createClass({
  getInitialState: function() {
    return {
      status: 'failed'
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name).value.trim();
    var comment = React.findDOMNode(this.refs.comment).value.trim();
    var status = this.state.status;
    // var comment = {
    //   name: React.findDOMNode(this.refs.name).value.trim(),
    //   comment: React.findDOMNode(this.refs.comment).value.trim(),
    //   status: this.state.status,
    //   time: Date.now()
    // };
    if (!name || !comment) {
      return;
    }
    this.props.onCommentSubmit({user: name, comment: comment, status: status});
    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.comment).value = '';

  },

  handleStatusChange: function(selected) {
    this.setState({status: selected});
  },
  render: function() {
    var radios = [
      {label: 'passed', value: 'passed'},
      {label: 'failed', value: 'failed'}
    ];
    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" ref="name" id="name" placeholder="Identity Yourself" />
        </div>
        <div className="form-group">
          <textarea className="form-control" ref="comment" id="comment" placeholder="Add Comment" row="3" />
        </div>
        <div className="form-group">
          <RadioSet group="status" onChange={this.handleStatusChange} radios={radios} selected={this.state.status} />
        </div>
        <button type='submit' className="btn btn-default">Submit</button>
      </form>
    );
  }
});

module.exports = CommentForm;
