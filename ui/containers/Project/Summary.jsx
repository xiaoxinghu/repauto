import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { activateProject } from '../../redux/modules/project'

@connect(
  state => ({projectId: state.router.params.projectId})
)
class Summary extends Component {
  componentDidMount() {
    const { dispatch, projectId } = this.props;
    dispatch(activateProject(projectId));
  }

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
