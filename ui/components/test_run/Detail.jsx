var React = require('react');
var Action = require('../../actions/TestCaseActions');
var TestCaseList = require('../test_case/FilterableList');
var MainView = require('../test_case/MainView');
var Store = require('../../stores/TestCaseStore');
var Detail = React.createClass({
  getInitialState: function() {
    Action.init(this.props.source);
    return {
    };
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-sm-3">
          <TestCaseList />
        </div>
        <div className="col-sm-9 full-height fill">
          <MainView store={Store}/>
        </div>
      </div>
    );
  }
});

module.exports = Detail;
