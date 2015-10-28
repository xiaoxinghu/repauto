import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ClassNames from 'classnames';
import helper from '../../helper';
import { unmark, invalidate, filter, fetch, VIEW, remove } from '../../modules/TestRun';
import _ from 'lodash';

@connect(
  state => ({
    activeProject: state.project.data[state.router.params.projectId],
    activeFilter: state.testRun.data.filter,
    marked: state.testRun.marked,
    path: state.router.location.pathname
  }),
  {pushState, unmark, invalidate, filter, fetch, remove}
)
export default class Toolbar extends Component {
  _handleClear() {
    const { unmark } = this.props;
    console.info('clear test run');
    unmark();
  }

  _handleFilter(selected) {
    const { unmark, invalidate, filter, fetch } = this.props;
    unmark();
    invalidate();
    filter(selected);
    fetch();
  }

    _handleDelete() {
        const {remove, marked} = this.props;
        for (let id of marked) {
            this.props.remove(id);
        }
        // console.info('delete');
    }

    _handleDiff() {
      const {pushState, marked, path} = this.props;
      pushState(null, `${path}/diff/${marked[0]}/${marked[1]}`);
    }

  render() {
    const { activeProject, activeFilter, marked } = this.props;
      let runNames = [];
      if (activeProject) {
          runNames = activeProject.run_names;
      }
    const options = runNames.map((name) => {
      return (
        <option key={_.uniqueId('filter')} value={name}>{name}</option>
      );
    });

    var filterBox = (
      <select className="form-control" onChange={(e) => this._handleFilter(e.target.value)} value={activeFilter}>
        <option value={VIEW.ALL}>ALL</option>
        {options}
        <option value={VIEW.BIN}>DELETED</option>
      </select>
    );
    var buttons = [
      <button key="btnDelete" className={ClassNames(
          'btn', 'btn-danger',
          {'disabled': marked.length == 0}
        )} onClick={() => this._handleDelete()}>
        <i className="fa fa-trash" />
      </button>,
      <button key="btnClear" className={ClassNames({
          'btn': true,
          'btn-default': true,
          'disabled': marked.length == 0
        })} onClick={() => this._handleClear()}>
        clear
      </button>,
      <button key="btnDiff" className={ClassNames({
          'btn': true,
          'btn-default': true,
          'disabled': marked.length != 2
        })} onClick={this._handleDiff.bind(this)}>
        diff
      </button>
    ];
    return (
      <div className="btn-toolbar inline">
        <div className="btn-group">
          {filterBox}
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
//   filter: PropTypes.bool
// }
