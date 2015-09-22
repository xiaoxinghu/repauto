var HoverToShow = React.createClass({
  getInitialState: function() {
    return { show: false };
  },

  mouseOver: function() {
    console.log('mouse over');
    this.setState({show: true});
  },

  mouseOut: function() {
    console.log('mouse out');
    this.setState({show: false});
  },
  render: function() {
    if (this.state.show) {
      var content = this.props.children;
    }
    return (
      <div style="height: 100%;width: 100%;" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
        {content}
      </div>
    );
  }
});

module.exports = HoverToShow;
