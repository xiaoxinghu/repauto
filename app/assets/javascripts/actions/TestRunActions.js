var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('../constants/TestRun').Action;

var TestRunActions = {
  select: function(id) {
    AppDispatcher.dispatch({
      actionType: Actions.SELECT,
      id: id
    });
  },

  filterBy: function(filter) {
    AppDispatcher.dispatch({
      actionType: Actions.FILTER,
      filter: filter
    });
  },

  remove: function(id) {
    AppDispatcher.dispatch({
      actionType: Actions.REMOVE,
      id: id
    });
  },
}

module.exports = TestRunActions;
