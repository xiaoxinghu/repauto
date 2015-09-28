var keyMirror = require('keymirror');

module.exports = {
  Event: keyMirror({
    RELOAD: null,
    SELECT: null
  }),
  Action: keyMirror({
    REMOVE: null,
    SELECT: null,
    CLEAR_SELECTION: null,
    FILTER: null
  }),
};
