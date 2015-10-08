var React = require('react');
var Actions = require('../../actions/TestCaseActions');
var Store = require('../../stores/TestCaseStore');

var HistoryLine = React.createClass({
  handleClick: function(target) {
    Actions.show([this.props.id, target]);
  },

  render: function() {
    var owner = Store.get(this.props.id);
    if (owner.history) {
      var history = owner.history.map(function(testCase) {
        var status = getStatusMeta(testCase.status);
        var className = 'btn btn-' + status.context;
        return (
          <button key={_.uniqueId('hist')} type='button' className={className} onClick={this.handleClick.bind(this, testCase.id)}>
            <i className={status.icon} />
          </button>
        );
      }, this);
    }
    return (
      <div className='row'>
        <div className='btn-group btn-group-sm'>
          {history}
        </div>
      </div>
    );
  }
});

module.exports = HistoryLine;
