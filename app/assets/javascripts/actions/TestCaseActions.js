var AppDispatcher = require('../dispatcher/AppDispatcher');
var Action = require('../constants/TestCase').Action;

var TestCaseActions = {
  filter: function(text) {
    AppDispatcher.dispatch({
      actionType: Action.FILTER,
      text: text
    });
  },

  changeGroupBy: function(groupBy) {
    AppDispatcher.dispatch({
      actionType: Action.GROUP,
      groupBy: groupBy
    });
  },

  show: function(data) {
    AppDispatcher.dispatch({
      actionType: Action.SHOW,
      data: data
    });
  },

  reset: function() {
    AppDispatcher.dispatch({
      actionType: Action.RESET
    });
  },

}

module.exports = TestCaseActions;
