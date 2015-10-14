var constants = require('./Constants');

module.exports = {
  FilterType: constants('TEST_RUN_FILTER_TYPE_', ['ALL']),
  Action: constants('TEST_RUN_ACTION_', [
    'INIT',
    'LOAD_MORE',
    'ARCHIVE',
    'RESTORE',
    'SELECT',
    'CLEAR_SELECTION',
    'FILTER'
  ])
};
