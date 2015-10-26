import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

@connect(
  state => ({
    projects: state.project.all,
    activeProjectId: state.router.params.projectId})
)
export default class Context extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
