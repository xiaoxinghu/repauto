var Store = require('../../stores/TestRunStore').store;
var Action = require('../../actions/TestRunActions');
var ClassNames = require('classnames');

var Toolbar = React.createClass({

  getInitialState: function() {
    return {
      selected: Store.getSelected(),
      types: Store.getTypes()
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
      selected: Store.getSelected(),
      types: Store.getTypes()
    });
  },

  _handleDelete: function() {
    Store.getSelected().forEach(function(id) {
      Action.remove(id);
    })
  },

  _filterByType: function(e) {
    Action.filterBy({type: e.target.value});
  },

  render: function() {
    types = this.state.types.map(function(t) {
      return (
        <option key={_.uniqueId('type')} value={t}>{t}</option>
      )
    });
    var filter = (
      <select className="form-control" onChange={this._filterByType} value={Store.getFilter().type}>
        {types}
      </select>
    );

    var toolbar = (
      <div className="btn-toolbar">
        <div className="btn-group">
          {filter}
        </div>
        <div className="btn-group" role="group" aria-label="...">
          <button className={ClassNames(
              'btn', 'btn-danger',
              {'disabled': this.state.selected.length == 0}
            )}>
            <i className="fa fa-trash" />
          </button>
          <button className={ClassNames({
              'btn': true,
              'btn-default': true,
              'disabled': this.state.selected.length == 0
            })}>
            clear
          </button>
          <button className={ClassNames({
              'btn': true,
              'btn-default': true,
              'disabled': this.state.selected.length != 2
            })}>
            diff
          </button>
        </div>
      </div>
    );
    return toolbar;
  }
});

module.exports = Toolbar;
