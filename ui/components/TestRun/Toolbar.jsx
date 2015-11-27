import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ClassNames from 'classnames';
import helper from '../../helper';
import { unmark, invalidate, filter, fetch, VIEW, remove, merge } from '../../modules/TestRun';
import { invalidateTrend } from '../../modules/Project';
import { Modal, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import _ from 'lodash';

@connect(
  state => ({
    activeProject: state.project.data[state.router.params.projectId],
    activeFilter: state.testRun.data.filter,
    marked: state.testRun.marked,
    all: state.testRun.data.all,
    path: state.router.location.pathname
  }),
  {pushState, unmark, invalidate, filter, fetch, remove, merge, invalidateTrend}
)
export default class Toolbar extends Component {
  constructor(props){
    super(props);
    this.state = {showNameSelector: false};
  }

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
    const {remove, marked, invalidateTrend} = this.props;
    for (let id of marked) {
      remove(id);
      invalidateTrend();
    }
  }

  _handleDiff() {
    const {pushState, marked, path, merge} = this.props;
    pushState(null, `${path}/diff/${marked[0]}/${marked[1]}`);
  }

  _handleMerge() {
    const {marked, all, merge} = this.props;
    const selectedNames = _.uniq(marked.map((id) => {
      return _.find(all, 'id', id).name;
    }));
    console.info(selectedNames);
    if (selectedNames.length > 1) {
      this.setState({showNameSelector: true});
    } else {
      merge(marked);
    }
  }

  render() {
    const { activeProject, activeFilter, marked, all } = this.props;
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

    return (
      <ButtonToolbar bsClass="inline">
        <ButtonGroup>
          {filterBox}
        </ButtonGroup>
        <ButtonGroup>
          <Button bsStyle="danger"
            disabled={marked.length == 0}
            onClick={this._handleDelete.bind(this)}>delete</Button>
          <Button bsStyle="default"
            disabled={marked.length == 0}
            onClick={this._handleClear.bind(this)}>clear</Button>
          <Button bsStyle="default"
            disabled={marked.length != 2}
            onClick={this._handleDiff.bind(this)}>diff</Button>
          <Button bsStyle="default"
            disabled={marked.length < 2}
            onClick={this._handleMerge.bind(this)}>merge</Button>
        </ButtonGroup>
        <Modal show={this.state.showNameSelector}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({showNameSelector: false})}>Close</Button>
          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
}

// Toolbar.PropTypes = {
//   run: PropTypes.object.isRequired,
//   filter: PropTypes.bool
// }
