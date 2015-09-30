var Action = require('../../actions/TestCaseActions');
var GroupedList = require('../test_case/GroupedList');
var MainView = require('../test_case/MainView');
var Store = require('../../stores/TestCaseStore');
var Diff = React.createClass({
  getInitialState: function() {
    console.debug('init diff', this.props.source);
    Action.init(this.props.source);
    return {
      total: 0
    };
  },

  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      total: Store.getTotal()
    });
  },

  render: function() {
    var all = Store.getAll();
    console.debug(all);
    return (
      <div className="row">
        <div className="col-sm-3">
          <GroupedList data={all}/>
        </div>
        <div className="col-sm-9 full-height fill">
          <MainView store={Store}/>
        </div>
      </div>
    );
  }
});

module.exports = Diff;
