var View = require('../../constants/TestCase').View;
var Store = require('../../stores/TestCaseStore');
var Detail = require('./Detail');

var MainView = React.createClass({
  getInitialState: function() {
    return {
      showing: Store.getShowing()
    };
  },
  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({showing: Store.getShowing()});
  },

  render: function() {
    var content = {};
    var showing = this.state.showing;
    var total =  showing.length;
    var colSize = 'col-md-' + (12 / total).toString();
    var columns = showing.map(function(id) {
      return (
        <div key={_.uniqueId('detail')} className={colSize}>
          <Detail id={id} />
        </div>
      );
    });
    return (
      <div className='row'>
        {columns}
      </div>
    );
  }
});

module.exports = MainView;
