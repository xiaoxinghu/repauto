var Row = require('./Row');
var Store = require('../../stores/TestRunStore').store;
var Actions = require('../../actions/TestRunActions');

var List = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },

  getInitialState: function() {
    Store.init(this.props.url);
    return {
      all: Store.getAll(),
      selected: [],
      filtered: Store.getAll(),
      type: 'all'
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

  _filterByType: function(e) {
    this.setState({type: e.target.value});
  },

  render: function() {
    console.debug('rendering list');
    var types = ['all'];
    this.state.all.forEach(function(tr) {
      if (types.indexOf(tr.type) == -1) {
        types.push(tr.type);
      }
    })
    types = types.map(function(t) {
      return (
        <option value={t}>{t}</option>
      )
    });
    var filter = (
      <select className="form-control" onChange={this._filterByType}>
        {types}
      </select>
    );

    var cx = React.addons.classSet;

    var toolbar = (
      <div className="btn-toolbar">
        <div className="btn-group">
          {filter}
        </div>
        <div className="btn-group" role="group" aria-label="...">
          <button className={cx({
              'btn': true,
              'btn-danger': true,
              'disabled': this.state.selected.length == 0
            })}>
            <i className="fa fa-trash" />
          </button>
          <button className={cx({
              'btn': true,
              'btn-default': true,
              'disabled': this.state.selected.length == 0
            })}>
            clear
          </button>
          <button className={cx({
              'btn': true,
              'btn-default': true,
              'disabled': this.state.selected.length != 2
            })}>
            diff
          </button>
        </div>
      </div>
    );

    var testRunRows = this.state.all.map(function (testRun) {
      if (this.state.type != 'all' && testRun.type != this.state.type) {
        return null;
      }
      return (
        <Row
          key={'row-' + testRun.id}
          data={testRun}
          onClick={this._handleRowClick}
          selected={this.state.selected.indexOf(testRun.id) > -1} />
      );
    }, this);
    if (Store.isThereMore()) {
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
        {toolbar}
        <div className="list-group">
          {testRunRows}
        </div>
        {loadMore}
      </div>
    );
  }
});

module.exports = List;
