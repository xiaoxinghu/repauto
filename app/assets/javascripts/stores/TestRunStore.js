var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestRun').Action;
var Event = require('../constants/TestRun').Event;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var SELECT_EVENT = 'select';

function getProgress(testRun) {
  $.ajax({
    url: testRun.url.progress,
    dataType: 'json',
    cache: false,
    success: function(data) {
      testRun["progress"] = data;
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(TestRun.url.progress, status, err.toString());
    }.bind(this)
  });
}

var TestRunStore = _.assign({}, EventEmitter.prototype, {

  init: function(source) {
    console.log('init test run store');
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
      success: function(data) {
        data.test_runs.forEach(function(d) {
          this.all[d.id] = d;
        }.bind(this));
        // this.all = this.all.concat(data.test_runs);
        this.meta = data.meta;
        this.fetchData.page += 1;
        this.emit(Event.RELOAD);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  },

  getAll: function() {
    if (_.isEmpty(this.all)) {
      this.getMore();
    }
    return _.values(this.all);
  },

  getProgress: function(id) {
    $.ajax({
      url: testRun.url.progress,
      dataType: 'json',
      cache: false,
      success: function(data) {
        testRun["progress"] = data;
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(TestRun.url.progress, status, err.toString());
      }.bind(this)
    });
  },

  select: function(id) {
    this.selected.push(id);
    this.emit(Event.SELECT);
  },

  unselect: function(id) {
    var i = this.selected.indexOf(id);
    if (i != -1) {
      this.selected.splice(i, 1);
    }
    this.emit(Event.SELECT);
  },

  remove: function(id) {
    delete this.all[id];
    this.emit(Event.RELOAD);
  },

  getSelected: function() {
    return this.selected;
  },

  // emitChange: function() {
  //   this.emit(CHANGE_EVENT);
  // },

  addChangeListener: function(e, callback) {
    this.on(e, callback);
  },

  removeChangeListener: function(e, callback) {
    this.removeListener(e, callback);
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
