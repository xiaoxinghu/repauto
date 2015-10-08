var React = require('react');
var Store = require('../../stores/TestRunStore').store;
var Action = require('../../actions/TestRunActions');
var FilterType = require('../../constants/TestRun').FilterType;
var ClassNames = require('classnames');
var _ = require('lodash');

var Toolbar = React.createClass({

  getInitialState: function() {
    return {
      selected: Store.getSelected()
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
      selected: Store.getSelected()
    });
  },

  _handleDelete: function() {
    Store.getSelected().forEach(function(id) {
      Action.archive(id);
    })
  },

  _handleRestore: function() {
    Store.getSelected().forEach(function(id) {
      Action.restore(id);
    })
  },

  _handleClear: function() {
    Action.clearSelection();
  },

  _handleDiff: function() {
    window.location.href = this.props.diff + "?left=" + this.state.selected[0] + "&right=" + this.state.selected[1];
  },

  _filterByType: function(e) {
    Action.filterBy({type: e.target.value});
  },

  render: function() {
    if (this.props.types) {
      var types = this.props.types.map(function(t) {
        return (
          <option key={_.uniqueId('type')} value={t}>{t}</option>
        )
      });
      var filter = (
        <select className="form-control" onChange={this._filterByType} value={Store.getFilter().type}>
          <option key={_.uniqueId('type')} value={FilterType.ALL}>all</option>
          {types}
        </select>
      );
    }

    if (this.props.params.action == 'bin') {
      var buttons = [
        <button key="btnRestore" className={ClassNames(
            'btn', 'btn-primary',
            {'disabled': this.state.selected.length == 0}
          )} onClick={this._handleRestore}>
          <i className="fa fa-trash" />
        </button>,
        <button key="btnClear" className={ClassNames({
            'btn': true,
            'btn-default': true,
            'disabled': this.state.selected.length == 0
          })} onClick={this._handleClear}>
          clear
        </button>
      ];
    } else {
      var buttons = [
        <button key="btnDelete" className={ClassNames(
            'btn', 'btn-danger',
            {'disabled': this.state.selected.length == 0}
          )} onClick={this._handleDelete}>
          <i className="fa fa-trash" />
        </button>,
        <button key="btnClear" className={ClassNames({
            'btn': true,
            'btn-default': true,
            'disabled': this.state.selected.length == 0
          })} onClick={this._handleClear}>
          clear
        </button>,
        <button key="btnDiff" className={ClassNames({
            'btn': true,
            'btn-default': true,
            'disabled': this.state.selected.length != 2
          })} onClick={this._handleDiff}>
          diff
        </button>
      ];
    }
    var toolbar = (
      <div className="btn-toolbar inline">
        <div className="btn-group">
          {filter}
        </div>
        <div className="btn-group" role="group" aria-label="...">
          {buttons}
        </div>
      </div>
    );
    return toolbar;
  }
});

module.exports = Toolbar;
