var SearchBar = React.createClass({
  handleChange: function(e) {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },

  render: function() {
    return (
      <form>
        <div className="input-group">
          <div className="input-group-addon"><i className="fa fa-search"></i></div>
          <input type="text" className="form-control" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange} />
        </div>
      </form>
    );
  }
});
