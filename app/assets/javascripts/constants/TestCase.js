var keyMirror = require('keymirror');

module.exports = {
  GroupBy: keyMirror({
    FEATURE: null,
    ERROR: null,
    TODO: null,
    HANDSET: null
  }),
  View: keyMirror({
    DETAIL: null,
    DIFF: null,
    GRID: null
  }),
  Action: keyMirror({
    FILTER: null,
    GROUP: null,
    SHOW: null,
    RESET: null
  }),
};
