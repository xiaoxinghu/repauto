var Toolbar = require('./Toolbar');
var List = require('./List');
var Store = require('../../stores/TestRunStore').store;

var ListView = React.createClass({
  getInitialState: function() {
    Store.init(this.props.url);
    return {
    };
  },

  render: function() {
    return (
      <div>
        <Toolbar />
        <List url={this.props.url} />
      </div>
    );
  }
});

module.exports = ListView;
