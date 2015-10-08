var React = require('react');
var View = require('../../constants/TestCase').View;
var Detail = require('./Detail');

var MainView = React.createClass({
  getInitialState: function() {
    return {
      showing: this.props.store.getShowing()
    };
  },
  componentDidMount: function() {
    this.props.store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    this.props.store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({showing: this.props.store.getShowing()});
  },

  render: function() {
    var content = {};
    var showing = this.state.showing;
    var total =  showing.length;
    var colSize = 'col-md-' + (12 / total).toString();
    var compact = total > 1;
    var columns = showing.map(function(id) {
      return (
        <div key={_.uniqueId('detail')} className={colSize}>
          <Detail id={id} store={this.props.store} compact={compact} />
        </div>
      );
    }, this);
    return (
      <div className='row'>
        {columns}
      </div>
    );
  }
});

module.exports = MainView;
