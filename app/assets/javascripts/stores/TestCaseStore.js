var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/TestCase');
var assign = require('object-assign');

var _all = {};

var TestCaseStore = _.assign({}, EventEmitter.prototype, {
  get: function(id) {

  },
});

module.exports = TestCaseStore;
