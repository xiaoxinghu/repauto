var constants = require('./Constants');

module.exports = {
  Mode: constants('TEST_CASE_MODE_', [
    'DIFF',
    'DETAIL'
  ]),
  GroupBy: constants('TEST_CASE_GROUP_BY_', [
    'FEATURE',
    'ERROR',
    'TODO',
    'HANDSET'
  ]),
  Action: constants('TEST_CASE_ACTION_', [
    'FILTER',
    'GROUP',
    'SHOW',
    'INIT',
    'COMMENT'
  ])
};
