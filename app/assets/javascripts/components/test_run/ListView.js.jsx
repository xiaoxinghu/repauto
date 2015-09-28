var Toolbar = require('./Toolbar');
var Help = require('./Help');
var Action = require('../../actions/TestRunActions');
var List = require('./List');
var Store = require('../../stores/TestRunStore').store;

var ListView = React.createClass({
  getInitialState: function() {
    Action.init(this.props.url);
    console.debug(this.props.params);
    if (this.props.params.type) {
      Action.filterBy({type: this.props.params.type});
    }
    return {
    };
  },

  render: function() {
    return (
      <div>
        <Toolbar params={this.props.params} />
        <Help />
        <List url={this.props.url} params={this.props.params} />
      </div>
    );
  }
});

module.exports = ListView;
