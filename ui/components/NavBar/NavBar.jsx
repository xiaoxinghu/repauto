import React, {Component, PropTypes} from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router'
import _ from 'lodash';

@connect(
  state => ({
    projects: state.project.all,
    active: state.project.active,
    a: state.router.params.projectId }),
    {pushState}
)
export default class NavBar extends Component {
  render() {
    console.info('rendering navbar');
    const { projects, active, pushState } = this.props;
    var items = _.values(projects).map(function(project) {
      return (
        <li  key={_.uniqueId('PROJECT')}>
          <a href='#' onClick={function() {
              pushState(null, `/projects/${project.id}`);
            }}>{project.name}</a>
        </li>);
    });
    var dropdownText = 'Select Project';
    if (!_.isEmpty(active)) {
      dropdownText = active.name;
      var navPanel = (
        <ul className='nav navbar-nav'>
          <li><Link to={`/projects/${active.id}`}>Summary</Link></li>
          <li><Link to={`/projects/${active.id}/trend`}>Trend</Link></li>
          <li><Link to={`/projects/${active.id}/runs`}>Test Runs</Link></li>
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
