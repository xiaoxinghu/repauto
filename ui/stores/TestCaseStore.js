var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestCase').Action;
var Mode = require('../constants/TestCase').Mode;
var GroupBy = require('../constants/TestCase').GroupBy;
var helper = require('../helper');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

// General
var _source, _all, _history, _showing, _mode;
// DIFF mode
var _prev, _current;

function init(source) {
  console.debug('init TestCaseStore');
  _source = source;
  _grouped = {};
  _all = {};
  _showing = [];
  _history = {};
  _prev = {};
  _current = {};
  $.ajax({
    url: _source,
    dataType: 'json',
    cache: false,
    success: gotData,
    error: function(xhr, status, err) {
      console.error(_source, status, err.toString());
    }
  });
}

function gotData(data) {
  console.debug("got", data);
  if (data.test_cases) {
    _mode = Mode.DETAIL;
    detailGotData(data);
  } else {
    _mode = Mode.DIFF;
    diffGotData(data);
  }
  TestCaseStore.emitChange();
}

function detailGotData(data) {
  data.test_cases.forEach(function(tc) {
    _all[tc.id] = tc;
    // test_suite = {name: ts.name};
    // ts.test_cases.forEach(function(tc) {
    //   tc.test_suite = test_suite
    //   _all[tc.id] = tc;
    // })
  });
}

function diffGotData(data) {
  data.prev.forEach(function(d) {
    _all[d.id] = d;
    _prev[d.md5] = d.id;
  });
  data.current.forEach(function(d) {
    _all[d.id] = d;
    _current[d.md5] = d.id;
  });
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
  return helper.groupBy(data, function(item) {
    switch (by) {
      case GroupBy.FEATURE:
        return item.test_suite;
        break;
      case GroupBy.ERROR:
        return item.failure ? item.failure.message : null;
        break;
      case GroupBy.TODO:
        if (item.status == 'passed' || (item.comments && item.comments.length > 0)) {return null};
        return item.test_suite;
        break;
      default:
        return item.test_suite;
        break;
    }
  }.bind(this));
}

function groupForDiff() {
  var grouped = {};
  var news = _.difference(_.keys(_current), _.keys(_prev)).map(function(md5) {
    return _all[_current[md5]];
  });
  var missing = _.difference(_.keys(_prev), _.keys(_current)).map(function(md5) {
    return _all[_prev[md5]];
  });

  var changes = _.keys(_current).filter(function(md5) {
    return (md5 in _prev) && _all[_current[md5]].status != _all[_prev[md5]].status;
  }).map(function(md5) {
    return _all[_current[md5]];
  });
  return {
    new: news,
    missing: missing,
    changes: changes
  }
}

function show(ids) {
  if (_mode == Mode.DETAIL) {
    _showing = ids;
    TestCaseStore.emitChange();
    _showing.forEach(function(id) {
      getHistory(id);
    });
  } else if(_mode == Mode.DIFF) {
    var id = ids[0];
    _showing = [id];
    var md5 = _all[id].md5;
    if (md5 in _prev && md5 in _current) {
      _showing = [_current[md5], _prev[md5]];
    } else {
      _showing = [id];
    }
    TestCaseStore.emitChange();
  }
}

function getHistory(id) {
  var tc = _all[id];
  if (!tc) {return;}
  if (tc.history) {return;}
  $.ajax({
    url: tc.api.history,
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
      console.error(tc.api.history, status, err.toString());
    }
  });
}

function comment(id, comment) {
  var tc = _all[id];
  $.ajax({
    url: tc.api.comment,
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
    if (!_mode) {return {};}
    if (_mode == Mode.DIFF) {return groupForDiff();}
    // if (!_.isEmpty(_grouped)) {return _grouped;}
    var data = _.values(_all);
    var filtered = filter(data, filterText);
    return group(filtered, groupBy);
  },

  get: function(id) {
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
