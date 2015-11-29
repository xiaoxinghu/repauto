import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

export default class RadioSet extends Component {
  handleChange(selected) {
    this.props.onChange(selected);
  }

  render() {
    const {radios, selected} = this.props;
    const content = radios.map(function(radio, i) {
      var className = "btn btn-primary";
      if (radio.value == selected) {
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
    const style = {
      margin: "0 5px 0 5px"
    };
    return (
      <div style={style} className="btn-group" role="group" aria-label="...">
        {content}
      </div>
    );
  }
};
