var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestCase').Action;
var GroupBy = require('../constants/TestCase').GroupBy;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var TestCaseStore = _.assign({}, EventEmitter.prototype, {
  init: function(source) {
    this.source = source;
    this.filterText = '';
    this.groupBy = GroupBy.FEATURE;
    this.all = {};
    $.ajax({
      // async: false,
      url: source,
      dataType: 'json',
      cache: false,
      success: this.gotData.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  },

  setFilterText: function(text) {
    this.filterText = text;
    this.emitChange();
  },

  setGroupBy: function(groupBy) {
    this.groupBy = groupBy;
    this.emitChange();
  },

  getGroupBy: function() {
    return this.groupBy;
  },

  _filter: function(data) {
    if (this.filterText === '') {
      return data;
    } else {
      var options = {
        keys: ['name']
      }
      var f = new Fuse(data, options);
      return f.search(this.filterText);
    }
  },

  _group: function(data) {
    return groupBy(data, function(item) {
      switch (this.groupBy) {
        case GroupBy.FEATURE:
          return item.test_suite.name;
          break;
        case GroupBy.ERROR:
          return item.failure ? item.failure.message : null;
          break;
        default:
          return item.test_suite.name;
          break;
      }
    }.bind(this));
  },

  getAll: function() {
    var data = _.values(this.all);
    var filtered = this._filter(data);
    return this._group(filtered);
  },

  gotData: function(data) {
    data.forEach(function(d) {
      this.all[d.id] = d;
    }.bind(this));
    this.emitChange();
  },

  get: function(id) {
    return this.all[id];
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

AppDispatcher.register(function(action) {
  var text;
  switch (action.actionType) {
    case Action.FILTER:
      TestCaseStore.setFilterText(action.text);
      break;
    case Action.GROUP:
      TestCaseStore.setGroupBy(action.groupBy);
      break;
    case Action.REMOVE:
      TestRunStore.remove(action.id);
      break;
    default:

  }
});

module.exports = TestCaseStore;
