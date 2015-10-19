var React = require('react');
var Stretchable = React.createClass({
  getInitialState: function() {
    return {
      height: 500
    };
  },

  componentDidMount: function() {
    this._stretch();
    window.addEventListener('resize', this._stretch);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this._stretch);
  },

  _stretch: function() {
    var rects = this.refs.stretchable.getClientRects();
    // console.debug(window.innerHeight, rects[0].top);
    this.setState({height: window.innerHeight - rects[0].top});
  },

  render: function() {
    var style = {
      height: this.state.height,
      width: '100%',
      overflow: 'scroll'
    };
    return (
      <div style={style} ref='stretchable'>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Stretchable;
