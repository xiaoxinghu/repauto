import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { activateProject } from '../../actions/project';

@connect(
  state => ({projectId: state.router.params.projectId})
)
class Summary extends Component {
  render() {
    return (
      <div>
        Project Summary
      </div>
    );
  }
}

function select(state) {
  return {
    projects: state.project.all,
    active: state.project.active
  };
}

export default connect(select)(Summary);
