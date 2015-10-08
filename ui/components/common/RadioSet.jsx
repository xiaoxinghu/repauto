var React = require('react');
var _ = require('lodash');
var RadioSet = React.createClass({
  getInitialState: function() {
    return {selected: null};
  },
  handleChange: function (selected) {
    this.props.onChange(selected);
  },

  render: function () {
    var radios = this.props.radios.map(function(radio, i) {
      var className = "btn btn-primary";
      if (radio.value == this.props.selected) {
        className += " active";
      }
      return (
        <button
          type="button"
          className={className}
          key={_.uniqueId('rb')}
          onClick={this.handleChange.bind(this, radio.value)}>
          {radio.label}
        </button>
      );
    }, this);
    return (
      <div className="btn-group" role="group" aria-label="...">
        {radios}
      </div>
    );
  }
});

module.exports = RadioSet;
