var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Action = require('../constants/TestRun').Action;
var FilterType = require('../constants/TestRun').FilterType;
var assign = require('object-assign');
var Immutable = require('immutable');
var Set = Immutable.Set;
var List = Immutable.List;

var CHANGE_EVENT = 'change';
var SELECT_EVENT = 'select';

var _source;
var _all = {};
var _bin = {};
var _progress = {};
var _filtered = [];
var _filter = {
  type: FilterType.ALL
};
var _selected = [];
var _fetchData = {
  page: 1
};
var _meta = null;

function init(source) {
  if (source == _source) {
    return;
  }
  _source = source;
  _all = {};
  _progress = {};
  _filtered = [];
  _filter = {
    type: FilterType.ALL
  };
  _selected = [];
  _fetchData = {
    page: 1
  };
  _meta = null;
}

function loadMore() {
  // if (!TestRunStore.isThereMore()) {return;}
  $.ajax({
    // async: false,
    url: _source,
    dataType: 'json',
    cache: false,
    data: _fetchData,
    success: gotData,
    error: function(xhr, status, err) {
      console.error(_url, status, err.toString());
    }
  });
}

function gotData(data) {
  data.test_runs.forEach(function(d) {
    if (d.summary) {
      d.summary.pr = getPassRate(d.summary).toString() + '%';
    }
    _all[d.id] = d;
  });
  // this.all = this.all.concat(data.test_runs);
  _meta = data.meta;
  _fetchData.page += 1;
  // this.filter();
  TestRunStore.emit(CHANGE_EVENT);
  // for(var id in this.all) {
  //   this.getProgress(id);
  // }
}

function setFilter(filter) {
  _filter = filter;
  _selected = [];
}

function getFiltered() {
  var filtered = _.values(_all).filter(function(tr) {
    return _filter.type == FilterType.ALL || _filter.type == tr.type;
  }).map(function(tr) {
    return tr.id;
  });
  filtered = List(filtered);
  if (!Immutable.is(_filtered, filtered)) {
    _filtered = filtered;
    _selected = [];
  }
  return _filtered;
}

function select(id) {
  if (id) {
    var i = _selected.indexOf(id);
    if (i != -1) {
      _selected.splice(i, 1);
    }else {
      _selected.push(id);
    }
    TestRunStore.emitChange();
  } else {
    _selected = _.keys(_all);
    TestRunStore.emitChange();
  }
}

function clear() {
  _selected = [];
  TestRunStore.emitChange();
}

function archive(id) {
  var testRun = _all[id];
  $.ajax({
    url: testRun.url.archive,
    dataType: 'json',
    cache: false,
    success: function(data) {
      delete _all[id];
      TestRunStore.emitChange();
    },
    error: function(xhr, status, err) {
      console.error(status, err.toString());
    }
  });
}
function restore(id) {
  var testRun = _all[id];
  $.ajax({
    url: testRun.url.restore,
    dataType: 'json',
    cache: false,
    success: function(data) {
      delete _all[id];
      TestRunStore.emitChange();
    },
    error: function(xhr, status, err) {
      console.error(status, err.toString());
    }
  });
}

var TestRunStore = _.assign({}, EventEmitter.prototype, {

  getAll: function() {
    if(_meta == null) {
      loadMore();
    }
    return getFiltered();
  },

  isThereMore: function() {
    if (!_meta) return false;
    return (_meta.next_page != null);
  },

  getById: function(id) {
    return _all[id] || _bin[id];
  },

  getProgress: function(id) {
    if (_progress[id]) {return _progress[id];}
    _progress[id] = 'loading...';
    var url = _all[id].url.progress;
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        _progress[id] = data;
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(_url, status, err.toString());
      }.bind(this)
    });
    return _progress[id];
  },

  getTypes: function() {
    var types = [FilterType.ALL];
    if (_all) {
      _.values(_all).forEach(function(tr) {
        if (types.indexOf(tr.type) == -1) {
          types.push(tr.type);
        }
      })
    }
    return types;
  },


  isSelected: function(id) {
    return (_selected.indexOf(id) != -1);
  },

  remove: function(id) {
    var testRun = _all[id];
    var link = testRun.url.archive || testRun.url.restore;
    $.ajax({
      url: link,
      dataType: 'json',
      cache: false,
      success: function(data) {
        delete _all[id];
        this.emit(CHANGE_EVENT);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getSelected: function() {
    return _selected;
  },

  getFilter: function() {
    return _filter;
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

// var Bin = _.cloneDeep(TestRunStore);

AppDispatcher.register(function(action) {
  var text;
  switch (action.actionType) {
    case Action.INIT:
      init(action.source);
      break;
    case Action.LOAD_MORE:
      loadMore();
      break;
    case Action.SELECT:
      select(action.id);
      break;
    case Action.CLEAR_SELECTION:
      clear();
      break;
    case Action.FILTER:
      setFilter(action.filter);
      TestRunStore.emitChange();
      break;
    case Action.ARCHIVE:
      archive(action.id);
      TestRunStore.emitChange();
      break;
    case Action.RESTORE:
      restore(action.id);
      TestRunStore.emitChange();
      break;
    default:

  }
});

module.exports = {
  store: TestRunStore
};
