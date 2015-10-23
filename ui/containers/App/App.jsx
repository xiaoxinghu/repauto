import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { NavBar } from '../../components';
import { fetchProjects } from '../../redux/modules/project'

@connect(
  state => ({projects: state.project.all})
)
export default class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProjects());
  }

  render() {
    return (
      <div>
        <NavBar />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
