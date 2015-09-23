var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestRun').Action;
var Event = require('../constants/TestRun').Event;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var SELECT_EVENT = 'select';

var TestRunStore = _.assign({}, EventEmitter.prototype, {

  init: function(source) {
    this.source = source;
    this.all = {};
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

  gotData: function(data) {
    data.test_runs.forEach(function(d) {
      if (d.summary) {
        d.summary.pr = getPassRate(d.summary).toString() + '%';
      }
      this.all[d.id] = d;
    }.bind(this));
    // this.all = this.all.concat(data.test_runs);
    this.meta = data.meta;
    this.fetchData.page += 1;
    this.emit(CHANGE_EVENT);
    for(var id in this.all) {
      this.getProgress(id);
    }
  },

  getAll: function() {
    if (_.isEmpty(this.all)) {
      this.getMore();
    }
    return _.values(this.all);
  },

  getProgress: function(id) {
    if (this.all[id].progress) {
      return this.all[id].progress;
    }
    $.ajax({
      url: this.all[id].url.progress,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.todo == 0) {
          delete data.todo;
        }
        data.pr = getPassRate(data).toString() + '%';
        this.all[id].progress = data;
        this.emit(CHANGE_EVENT);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(TestRun.url.progress, status, err.toString());
      }.bind(this)
    });
  },

  select: function(id) {
    if (id) {
      this.selected.push(id);
      this.emit(CHANGE_EVENT);
    } else {
      this.selected = _.keys(this.all);
      this.emit(CHANGE_EVENT);
    }
  },

  unselect: function(id) {
    if (id) {
      var i = this.selected.indexOf(id);
      if (i != -1) {
        this.selected.splice(i, 1);
      }
      this.emit(CHANGE_EVENT);
    } else {
      this.selected = [];
      this.emit(CHANGE_EVENT);
    }
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

  // emitChange: function() {
  //   this.emit(CHANGE_EVENT);
  // },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

var Bin = _.cloneDeep(TestRunStore);

AppDispatcher.register(function(action) {
  var text;
  switch (action.actionType) {
    case Action.SELECT:
      TestRunStore.select(action.id);
      break;
    case Action.UNSELECT:
      TestRunStore.unselect(action.id);
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
