var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('../constants/TestRun').Action;

var TestRunActions = {
  init: function(source) {
    AppDispatcher.dispatch({
      actionType: Actions.INIT,
      source: source
    });
  },

  select: function(id) {
    AppDispatcher.dispatch({
      actionType: Actions.SELECT,
      id: id
    });
  },

  loadMore: function() {
    AppDispatcher.dispatch({
      actionType: Actions.LOAD_MORE
    });
  },

  clearSelection: function() {
    AppDispatcher.dispatch({
      actionType: Actions.CLEAR_SELECTION,
    });
  },

  filterBy: function(filter) {
    AppDispatcher.dispatch({
      actionType: Actions.FILTER,
      filter: filter
    });
  },

  archive: function(id) {
    AppDispatcher.dispatch({
      actionType: Actions.ARCHIVE,
      id: id
    });
  },

  restore: function(id) {
    AppDispatcher.dispatch({
      actionType: Actions.RESTORE,
      id: id
    });
  },
}

module.exports = TestRunActions;
