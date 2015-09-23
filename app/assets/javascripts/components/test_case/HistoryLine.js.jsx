var Actions = require('../../actions/TestCaseActions');

var HistoryLine = React.createClass({
  handleClick: function(target) {
    Actions.show([this.props.owner, target]);
  },

  render: function() {
    var owner = this.props.owner;
    if (owner.history) {
      var history = owner.history.map(function(testCase) {
        var status = getStatusMeta(testCase.status);
        var className = 'btn btn-' + status.context;
        return (
          <button key={_.uniqueId('hist')} type='button' className={className} onClick={this.handleClick.bind(this, testCase)}>
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
