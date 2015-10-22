import React, {Component, PropTypes} from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';

@connect(
  state => ({
    projects: state.project.all,
    a: state.project.active,
    active: state.router.params.projectId })
)
export default class NavBar extends Component {
  render() {
    const {projects, active} = this.props;
    var items = projects.map(function(project) {
      return (
        <li  key={_.uniqueId('PROJECT')}>
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </li>);
    });
    var activeProject = projects.find(p => p.id == active);
    var dropdownText = 'Select Project';
    if (activeProject) {
      dropdownText = activeProject.name;
      var navPanel = (
        <ul className='nav navbar-nav'>
          <li><Link to={`/projects/${activeProject.id}`}>Summary</Link></li>
          <li><Link to={`/projects/${activeProject.id}/trend`}>Trend</Link></li>
          <li><Link to={`/projects/${activeProject.id}/runs`}>Test Runs</Link></li>
        </ul>
      );
    }
    const projectList = (
      <li className='dropdown'>
        <a href='#'
          className='dropdown-toggle'
          data-toggle='dropdown'
          role='button'
          aria-haspopup='true'
          aria-expanded='false'>
          {dropdownText}
          <span className='caret' />
        </a>
        <ul className='dropdown-menu' role='menu'>
          {items}
        </ul>
      </li>
    );
    return (
      <div className='navbar navbar-default navbar-fixed-top'>
        <div className='container-fluid'>
          <Link to='/' className='navbar-brand' component={IndexLink}>
            Repauto
          </Link>
          {navPanel}
          <ul className='nav navbar-nav navbar-right'>
            {projectList}
          </ul>
        </div>
      </div>
    );
  }
}
