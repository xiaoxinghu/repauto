import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import configureStore from '../../redux/store'
import { fetchProjects } from '../../redux/modules/project'
// import * as projectActions from '../../redux/modules/project';

// @connect(
//   state => ({projects: state.projects}),
//   dispatch => bindActionCreators(projectActions, dispatch)
// )
class Navbar extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    console.debug('dispatch fetch');
    dispatch(fetchProjects());
  }
  render() {
    const { projects } = this.props;
    console.debug('render', projects);
    var content = projects.map(project => (
      <h2>{project.project}</h2>
    ));
    return (
      <div>
        {content}
      </div>
    );
  }
}

function select(state) {
  return {
    projects: state.projects
  };
}

export default connect(select)(Navbar);
