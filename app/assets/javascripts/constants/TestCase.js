var keyMirror = require('keymirror');

module.exports = {
  GroupBy: keyMirror({
    FEATURE: null,
    ERROR: null,
    TODO: null,
    HANDSET: null
  }),
  Action: keyMirror({
    FILTER: null,
    GROUP: null,
    SHOW: null,
    RESET: null,
    COMMENT: null
  }),
};
