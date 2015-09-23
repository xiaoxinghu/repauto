var AppDispatcher = require('../dispatcher/AppDispatcher');
var TestCaseStore = require('./TestCaseStore');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestCase').Action;
var View = require('../constants/TestCase').View;
var assign = require('object-assign');

var _showing = [];

function reset() {
  _showing = [];
}

function show(data) {
  _showing = data;
  if (!_.isArray(data) && !data.history) {
    $.ajax({
      url: data.url.history,
      dataType: 'json',
      cache: false,
      success: function(d) {
        data.history = d;
        TestCaseDetailStore.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
  }
}

function diff(left, right) {
  _showing = [left, right];
}

var CHANGE_EVENT = 'change';
var TestCaseDetailStore = _.assign({}, EventEmitter.prototype, {

  getShowing: function() {
    return _showing;
  },

  getDetail: function(id) {
    return TestCaseStore.get(id);
  },

  getView: function() {
    return View.DETAIL;
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
    // case Action.SHOW:
    //   show(action.data);
    //   TestCaseDetailStore.emitChange();
    //   break;
    // case Action.RESET:
    //   reset();
    //   TestCaseDetailStore.emitChange();
    //   break;
    default:

  }
});
module.exports = TestCaseDetailStore;
