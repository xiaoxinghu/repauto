var Toolbar = require('./Toolbar');
var Info = require('./Info');
var Action = require('../../actions/TestRunActions');
var List = require('./List');
var Store = require('../../stores/TestRunStore').store;

var Index = React.createClass({
  getInitialState: function() {
    Action.init(this.props.url);
    if (this.props.params.type) {
      Action.filterBy({type: this.props.params.type});
    }
    return {
    };
  },

  render: function() {
    return (
      <div>
        <div className="row toolbar">
          <div className="col-md-3">
            <Toolbar params={this.props.params} types={this.props.types} diff={this.props.diff_url} />
          </div>
          <div className="col-md-9">
            <Info />
          </div>
        </div>
        <List url={this.props.url} params={this.props.params} />
      </div>
    );
  }
});

module.exports = Index;
