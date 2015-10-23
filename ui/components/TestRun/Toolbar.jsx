import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ClassNames from 'classnames';
import helper from '../../helper';
import { unSelectTestRun } from '../../redux/modules/run'
import _ from 'lodash';

@connect(
  state => ({
    project: state.project.active,
    runName: state.run.name,
    selected: state.run.selected
  }),
  {pushState, unSelectTestRun}
)
export default class Toolbar extends Component {
  _handleClear() {
    const { unSelectTestRun } = this.props;
    console.info('clear test run');
    unSelectTestRun();
  }

  render() {
    const { project, runName, selected } = this.props;
    let runs = ['ALL', ...project.run_names || []];
    const options = runs.map((name) => {
      return (
        <option key={_.uniqueId('type')} value={name}>{name}</option>
      );
    });

    var filter = (
      <select className="form-control" onChange={this._filterByType} value={runName}>
        {options}
      </select>
    );
    var buttons = [
      <button key="btnDelete" className={ClassNames(
          'btn', 'btn-danger',
          {'disabled': selected.length == 0}
        )} onClick={this._handleDelete}>
        <i className="fa fa-trash" />
      </button>,
      <button key="btnClear" className={ClassNames({
          'btn': true,
          'btn-default': true,
          'disabled': selected.length == 0
        })} onClick={() => this._handleClear()}>
        clear
      </button>,
      <button key="btnDiff" className={ClassNames({
          'btn': true,
          'btn-default': true,
          'disabled': selected.length != 2
        })} onClick={this._handleDiff}>
        diff
      </button>
    ];
    return (
      <div className="btn-toolbar inline">
        <div className="btn-group">
          {filter}
        </div>
        <div className="btn-group" role="group" aria-label="...">
          {buttons}
        </div>
      </div>
    );
  }
}

// Toolbar.PropTypes = {
//   run: PropTypes.object.isRequired,
//   runName: PropTypes.bool
// }
