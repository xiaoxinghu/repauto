var React = require('react');
var Comment = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    status: React.PropTypes.string,
    comment: React.PropTypes.string,
    time: React.PropTypes.string
  },
  render: function() {
    return (
      <li className="media">
        <div className="media-left">
          <a href="#">
            <i className='fa fa-comment' />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            {this.props.name + ": " + this.props.status}
            <small>{showDateTime(this.props.time)}</small>
          </h4>
          <p>{this.props.comment}</p>
        </div>
      </li>
    );
  }
});

module.exports = Comment;
