import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { RadioSet } from '../../components';
import ClassNames from 'classnames';
import { fetchSumamry } from '../../modules/Project';
import _ from 'lodash';
import helper from '../../helper';

export default class TrendControlPanel extends Component {
  _handleSwitchRun(e) {
    const run = e.target.value;
    this.props.onSwitchRun(run);
  }

  _handleSwitchMode(mode) {
    this.props.onSwitchMode(mode);
  }

  render() {
    const { runs, selected, mode, filter } = this.props;
    const options = runs.map(function(t) {
      return (
        <option key={_.uniqueId('run')} value={t}>{t}</option>
      );
    });
    const runSelector = (
      <div className="form-group">
        <label htmlFor="runSelector">Select Run</label>
        <select id="runSelector" className="form-control" onChange={this._handleSwitchRun.bind(this)} value={selected}>
          <option key={_.uniqueId('type')} value=''>Select Run</option>
          {options}
        </select>
      </div>
    );
    const radios = [
      {label: ('manual'), value: 'proc'},
      {label: ('raw'), value: 'ori'}
    ];
    const modeToggle = (
      <div className="form-group">
        <RadioSet group="view" onChange={this._handleSwitchMode.bind(this)} radios={radios} selected={mode} />
      </div>
    );
    const filterSlider = (
      <div className="form-group">
        <label htmlFor="filterSlider">Filter: {filter}%</label>
        <input
          id="filterSlider"
          type="range"
          min="0"
          max="100"
          step="10"
          value={filter} onChange={e => this.props.onFilterChange(e.target.value)} />
      </div>
    );
    return (
      <div>
        <form>
          {runSelector}
          {modeToggle}
          {filterSlider}
        </form>
      </div>
    );
  }
}

