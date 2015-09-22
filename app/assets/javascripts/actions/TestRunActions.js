var AppDispatcher = require('../dispatcher/AppDispatcher');
var Actions = require('../constants/TestRun').Action;

var TestRunActions = {
  select: function(id) {
    AppDispatcher.dispatch({
      actionType: Actions.SELECT,
      id: id
    });
  },

  unselect: function(id) {
    AppDispatcher.dispatch({
      actionType: Actions.UNSELECT,
      id: id
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
