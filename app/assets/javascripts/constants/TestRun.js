var keyMirror = require('keymirror');

module.exports = {
  FilterType: {
    DELETED: 'deleted',
    ALL: 'all'
  },
  Event: keyMirror({
    RELOAD: null,
    SELECT: null
  }),
  Action: keyMirror({
    INIT: null,
    LOAD_MORE: null,
    ARCHIVE: null,
    RESTORE: null,
    SELECT: null,
    CLEAR_SELECTION: null,
    FILTER: null
  }),
};
