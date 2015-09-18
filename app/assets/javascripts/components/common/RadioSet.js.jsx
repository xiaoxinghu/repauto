var RadioSet = React.createClass({
  getInitialState: function() {
    return {selected: null};
  },
  handleChange: function (selected) {
    this.props.onChange(selected);
    this.setState({selected: selected});
  },

  render: function () {
    var radios = this.props.radios.map(function(radio, i) {
      var id = _.uniqueId('rs-');
      return (
        <button type="button" className="btn btn-default" key={_.uniqueId('rb')}>
          {radio.label}
        </button>
      );
      // return (
      //   <label key={_.uniqueId('rb')} className="checkbox-inline">
      //     <input
      //       type="radio"
      //       name={this.props.group}
      //       value={radio.value}
      //       defaultChecked={radio.checked}
      //       onChange={this.handleChange}>{radio.label}</input>
      //   </label>
      // );
    }, this);
    return (
      <div className="btn-group" role="group" aria-label="...">
        {radios}
      </div>
    );
  }
});

module.exports = RadioSet;
