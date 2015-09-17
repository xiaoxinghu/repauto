var RadioSet = React.createClass({
  handleChange: function (e) {
    this.props.onChange(e.target.value);
  },

  render: function () {
    var radios = this.props.radios.map(function(radio, i) {
      var id = _.uniqueId('rs-')
      return (
        <label key={_.uniqueId('rb')} className="checkbox-inline">
          <input
            type="radio"
            name={this.props.group}
            value={radio.value}
            defaultChecked={radio.checked}
            onChange={this.handleChange}>{radio.label}</input>
        </label>
      );
    }, this);
    return (
      <fieldset className="ToggleSet">
        {radios}
      </fieldset>
    );
  }
});
