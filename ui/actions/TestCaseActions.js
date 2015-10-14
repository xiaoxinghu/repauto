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

  show: function(ids) {
    AppDispatcher.dispatch({
      actionType: Action.SHOW,
      ids: ids
    });
  },

  init: function(source) {
    AppDispatcher.dispatch({
      actionType: Action.INIT,
      source: source
    });
  },

  comment: function(id, comment) {
    AppDispatcher.dispatch({
      actionType: Action.COMMENT,
      id: id,
      comment: comment
    });
  }

}

module.exports = TestCaseActions;
