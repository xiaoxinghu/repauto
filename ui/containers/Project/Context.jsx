import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { activateProject } from '../../actions/project';

@connect(
  state => ({
    projects: state.project.all,
    activeProjectId: state.router.params.projectId}),
  {activateProject}
)
export default class Context extends Component {
  componentDidMount() {
    this._activate();
  }

  componentWillReceiveProps(nextProps) {
    this._activate();
  }

  _activate() {
    const { activeProjectId, activateProject } = this.props;
    activateProject(activeProjectId);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
