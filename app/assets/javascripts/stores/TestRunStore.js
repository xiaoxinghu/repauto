var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestRun').Action;
var Event = require('../constants/TestRun').Event;
var assign = require('object-assign');
var Immutable = require('immutable');
var Set = Immutable.Set;
var List = Immutable.List;

var CHANGE_EVENT = 'change';
var SELECT_EVENT = 'select';

var TestRunStore = _.assign({}, EventEmitter.prototype, {

  init: function(source) {
    console.debug('init TestRunStore');
    this.source = source;
    this.all = {};
    this.progress = {};
    this.filtered = [];
    this.filter = {
      type: 'all'
    };
    this.selected = [];
    this.fetchData = {
      page: 1
    };
  },

  getMore: function() {
    $.ajax({
      // async: false,
      url: this.source,
      dataType: 'json',
      cache: false,
      data: this.fetchData,
      success: this.gotData.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  },

  isThereMore: function() {
    if (!this.meta) return false;
    console.debug(this.meta.next_page != null);
    return (this.meta.next_page != null);
  },

  gotData: function(data) {
    data.test_runs.forEach(function(d) {
      if (d.summary) {
        d.summary.pr = getPassRate(d.summary).toString() + '%';
      }
      this.all[d.id] = d;
    }.bind(this));
    // this.all = this.all.concat(data.test_runs);
    this.meta = data.meta;
    console.debug(data);
    this.fetchData.page += 1;
    // this.filter();
    this.emit(CHANGE_EVENT);
    // for(var id in this.all) {
    //   this.getProgress(id);
    // }
  },

  setFilter: function(filter) {
    this.filter = filter;
    this.selected = [];
  },

  _filter: function() {
    var filtered = _.values(this.all).filter(function(tr) {
      return this.filter.type == 'all' || this.filter.type == tr.type;
    }, this).map(function(tr) {
      return tr.id;
    });
    filtered = List(filtered);
    if (!Immutable.is(this.filtered, filtered)) {
      this.filtered = filtered;
      this.selected = [];
    }
    return this.filtered;
  },

  getAll: function() {
    if (!this.meta) {
      this.getMore();
    }
    return this._filter();
  },

  getProgress: function(id) {
    if (this.progress[id]) {return this.progress[id];}
    var url = this.all[id].url.progress;
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.progress[id] = data;
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  },


  getById: function(id) {
    return this.all[id];
  },

  getTypes: function() {
    var types = ['all'];
    if (this.all) {
      _.values(this.all).forEach(function(tr) {
        if (types.indexOf(tr.type) == -1) {
          types.push(tr.type);
        }
      })
    }
    return types;
  },

  select: function(id) {
    if (id) {
      var i = this.selected.indexOf(id);
      if (i != -1) {
        this.selected.splice(i, 1);
      }else {
        this.selected.push(id);
      }
      this.emit(CHANGE_EVENT);
    } else {
      this.selected = _.keys(this.all);
      this.emit(CHANGE_EVENT);
    }
  },

  clear: function() {
    this.selected = [];
    this.emit(CHANGE_EVENT);
  },

  isSelected: function(id) {
    return (this.selected.indexOf(id) != -1);
  },

  remove: function(id) {
    var testRun = this.all[id];
    var link = testRun.url.archive || testRun.url.restore;
    $.ajax({
      url: link,
      dataType: 'json',
      cache: false,
      success: function(data) {
        delete this.all[id];
        this.emit(CHANGE_EVENT);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getSelected: function() {
    return this.selected;
  },

  getFilter: function() {
    return this.filter;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

TestRunStore.setMaxListeners(0);

var Bin = _.cloneDeep(TestRunStore);

AppDispatcher.register(function(action) {
  var text;
  switch (action.actionType) {
    case Action.SELECT:
      TestRunStore.select(action.id);
      break;
    case Action.CLEAR_SELECTION:
      TestRunStore.clear();
      break;
    case Action.FILTER:
      TestRunStore.setFilter(action.filter);
      TestRunStore.emitChange();
      break;
    case Action.REMOVE:
      TestRunStore.remove(action.id);
      break;
    default:

  }
});

module.exports = {
  store: TestRunStore,
  bin: Bin
};
