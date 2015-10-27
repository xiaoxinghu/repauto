import React, {Component, PropTypes} from 'react';

export default class Stretchable extends Component {
  constructor(props){
    super(props);
    this.state = {height: 500};
  }

  componentDidMount() {
    this._stretch();
    window.addEventListener('resize', this._stretch);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._stretch);
  }

  _stretch() {
    var rects = this.refs.stretchable.getClientRects();
    // console.debug(window.innerHeight, rects[0].top);
    this.setState({height: window.innerHeight - rects[0].top});
  }

  render() {
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
};
