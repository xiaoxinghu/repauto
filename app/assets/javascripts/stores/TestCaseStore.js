var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestCase').Action;
var GroupBy = require('../constants/TestCase').GroupBy;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var TestCaseStore = _.assign({}, EventEmitter.prototype, {
  init: function(source) {
    this.source = source;
    this.all = {};
    this.history = {};
    this.showing = [];
    $.ajax({
      // async: false,
      url: source,
      dataType: 'json',
      cache: false,
      success: this._gotData.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  },

  _filter: function(data, text) {
    if (text === '') {
      return data;
    } else {
      var options = {
        keys: ['name']
      }
      var f = new Fuse(data, options);
      return f.search(text);
    }
  },

  _group: function(data, by) {
    return groupBy(data, function(item) {
      switch (by) {
        case GroupBy.FEATURE:
          return item.test_suite.name;
          break;
        case GroupBy.ERROR:
          return item.failure ? item.failure.message : null;
          break;
        case GroupBy.TODO:
          if (item.status == 'passed' || item.comments) {return null};
          return item.test_suite.name;
          break;
        default:
          return item.test_suite.name;
          break;
      }
    }.bind(this));
  },

  getAll: function(groupBy, filterText) {
    var data = _.values(this.all);
    var filtered = this._filter(data, filterText);
    return this._group(filtered, groupBy);
  },

  get: function(id) {
    return this.all[id] || this.history[id];
  },

  show: function(ids) {
    this.showing = ids;
    this.emitChange();
    this.showing.forEach(function(id) {
      this._getHistory(id);
    }, this);
  },

  comment: function(id, comment) {
    var tc = this.all[id];
    $.ajax({
      url: tc.url.comment,
      dataType: 'json',
      type: 'POST',
      cache: false,
      data: comment,
      success: function(test_case) {
        tc.comments = test_case.comments;
        console.log(test_case);
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  },

  _getHistory: function(id) {
    var tc = this.all[id];
    if (!tc) {return;}
    if (tc.history) {return;}
    $.ajax({
      url: tc.url.history,
      dataType: 'json',
      cache: false,
      success: function(d) {
        tc.history = d;
        d.forEach(function(h){
          this.history[h.id] = h;
        }, this);
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  },

  getShowing: function() {
    return this.showing;
  },

  getTotal: function() {
    return _.values(this.all).length;
  },

  _gotData: function(data) {
    data.forEach(function(d) {
      this.all[d.id] = d;
    }.bind(this));
    this.emitChange();
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
    case Action.SHOW:
      TestCaseStore.show(action.ids);
      break;
    case Action.RESET:
      reset();
      TestCaseStore.emitChange();
      break;
    case Action.COMMENT:
      TestCaseStore.comment(action.id, action.comment);
      break;
    default:
  }
});

module.exports = TestCaseStore;
