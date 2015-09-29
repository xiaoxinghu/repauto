var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestCase').Action;
var GroupBy = require('../constants/TestCase').GroupBy;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _source, _all, _history, _showing, _grouped;

function init(source) {
  console.debug('init TestCaseStore');
  _source = source;
  _grouped = {};
  _all = {};
  _showing = [];
  _history = {};
  $.ajax({
    url: _source,
    dataType: 'json',
    cache: false,
    success: gotData,
    error: function(xhr, status, err) {
      console.error(_source, status, err.toString());
    }
  });
  // if (typeof data === "string") {
  // } else {
  //   _source = null;
  //   _all = {};
  //   _.union(_.values(data)).forEach(function(tc) {
  //     _all[tc.id] = tc;
  //   });
  //   _grouped = data;
  // }
}

function gotData(data) {
  if (data instanceof Array) {
    data.forEach(function(d) {
      _all[d.id] = d;
    });
  } else {
    _grouped = data;
    _all = {};
    _.values(data).forEach(function(array) {
      array.forEach(function(tc) {
        _all[tc.id] = tc;
      });
    });
  }
  TestCaseStore.emitChange();
}

function filter(data, text) {
  if (text === '') {
    return data;
  } else {
    var options = {
      keys: ['name']
    }
    var f = new Fuse(data, options);
    return f.search(text);
  }
}

function group(data, by) {
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
}

function show(ids) {
  console.debug('showing', ids);
  _showing = ids;
  TestCaseStore.emitChange();
  _showing.forEach(function(id) {
    getHistory(id);
  });
}

function getHistory(id) {
  var tc = _all[id];
  if (!tc) {return;}
  if (tc.history) {return;}
  $.ajax({
    url: tc.url.history,
    dataType: 'json',
    cache: false,
    success: function(d) {
      tc.history = d;
      d.forEach(function(h){
        _history[h.id] = h;
      });
      TestCaseStore.emitChange();
    },
    error: function(xhr, status, err) {
      console.error(tc.url.history, status, err.toString());
    }
  });
}

function comment(id, comment) {
  var tc = _all[id];
  $.ajax({
    url: tc.url.comment,
    dataType: 'json',
    type: 'POST',
    cache: false,
    data: comment,
    success: function(test_case) {
      tc.comments = test_case.comments;
      TestCaseStore.emitChange();
    },
    error: function(xhr, status, err) {
      console.error(_url, status, err.toString());
    }
  });
}

var TestCaseStore = _.assign({}, EventEmitter.prototype, {
  // init: function(source) {
  //   this.source = source;
  //   this.all = {};
  //   this.history = {};
  //   this.showing = [];
  //   $.ajax({
  //     // async: false,
  //     url: source,
  //     dataType: 'json',
  //     cache: false,
  //     success: this._gotData.bind(this),
  //     error: function(xhr, status, err) {
  //       console.error(_url, status, err.toString());
  //     }.bind(this)
  //   });
  // },



  getAll: function(groupBy, filterText) {
    if (!_.isEmpty(_grouped)) {return _grouped;}
    var data = _.values(_all);
    var filtered = filter(data, filterText);
    return group(filtered, groupBy);
  },

  get: function(id) {
    console.debug('want', id, 'have', _.keys(_all));
    return _all[id] || _history[id];
  },

  getShowing: function() {
    return _showing;
  },

  getTotal: function() {
    return _.values(_all).length;
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
      show(action.ids);
      break;
    case Action.INIT:
      init(action.source);
      TestCaseStore.emitChange();
      break;
    case Action.COMMENT:
      comment(action.id, action.comment);
      break;
    default:
  }
});

module.exports = TestCaseStore;
