var Status = require('../common').Status;

var Help = React.createClass({

  render: function() {
    sample = {
      passed: 'passed',
      failed: 'failed',
      broken: 'broken',
      pending: 'pending',
      pr: 'pass rate',
      todo: 'todo',
    }
    return (
      <div className="inline pull-right">
        <Status data={sample} />
        <p>Hold <em className="text-info">Ctrl</em> (<em className="text-info">⌘</em> on Mac) while clicking to select.</p>
      </div>
    );
  }
});

module.exports = Help;
