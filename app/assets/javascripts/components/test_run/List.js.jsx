var Row = require('./Row');
var Store = require('../../stores/TestRunStore').store;
var Actions = require('../../actions/TestRunActions');
var ClassNames = require('classnames');
var PureRenderMixin = React.addons.PureRenderMixin;

var List = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      all: Store.getAll(),
    };
  },

  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({all: Store.getAll()});
  },


  _handleRowClick: function(e, id) {
    if (e.ctrlKey || e.metaKey) {
      var selected = this.state.selected;
      var i = selected.indexOf(id);
      if (i != -1) {
        selected.splice(i, 1);
      } else {
        selected.push(id);
      }
      this.setState({selected: selected});
    } else {
      console.debug('go to', id);
    }
  },

  render: function() {
    console.debug('rendering list');

    var testRunRows = this.state.all.toJS().map(function (id) {
      return (
        <Row
          key={_.uniqueId('row')}
          id={id}
          onClick={this._handleRowClick} />
      );
    }, this);
    if (Store.isThereMore()) {
      console.log('there are more');
      var loadMore = (
        <ul className="pager">
          <li>
            <a href="#" onClick={function() {Store.getMore();}}>More</a>
          </li>
        </ul>
      );
    }

    return (
      <div>
        <div className="list-group">
          {testRunRows}
        </div>
        {loadMore}
      </div>
    );
  }
});

module.exports = List;
