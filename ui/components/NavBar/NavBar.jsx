import React, {Component, PropTypes} from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { invalidate } from '../../modules/TestRun';
import { invalidateTrend } from '../../modules/Project';
import _ from 'lodash';

@connect(
  state => ({
    projects: state.project.data,
    activeProject: state.project.data[state.router.params.projectId],
    a: state.router.params.projectId }),
  {pushState, invalidate, invalidateTrend}
)
  export default class NavBar extends Component {
    render() {
      const { projects, activeProject, pushState, invalidate, invalidateTrend } = this.props;
      const grouped = _.groupBy(_.values(projects), 'stream');
      var items = [];
      for (let stream in grouped) {
        items.push(
          <li className="dropdown-header" key={_.uniqueId('STREAM')}>
            {stream}
          </li>
        );
        items.push(...grouped[stream].map((project) => {
          return (
            <li  key={_.uniqueId('PROJECT')}>
              <a href='#' onClick={function() {
                  invalidate();
                  invalidateTrend();
                  pushState(null, `/projects/${project.id}`);
                }}>{project.name}</a>
            </li>);
        }));
        items.push(
          <li key={_.uniqueId('DIV')} role='separator' className='divider' />
        );
      }
      items.pop();
      var dropdownText = 'Select Project';
      if (!_.isEmpty(activeProject)) {
        dropdownText = activeProject.name;
        var navPanel = (
          <ul className='nav navbar-nav'>
            <li><Link to={`/projects/${activeProject.id}`}>Summary</Link></li>
            <li><Link to={`/projects/${activeProject.id}/trend`}>Trend</Link></li>
            <li><Link to={`/projects/${activeProject.id}/matrix`}>Matrix</Link></li>
            <li><Link to={`/projects/${activeProject.id}/runs`}>Test Runs</Link></li>
          </ul>
        );
      }
      var infoPanel = (
          <ul className='nav navbar-nav pull-right'>
            <li>
              <a href="#" data-toggle="modal" data-target="#about">
                <i className="fa fa-info-circle fa-lg" />
              </a>
            </li>
          </ul>
      );
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
        <div className='navbar navbar-default navbar-fixed-top navbar-inverse'>
          <div className='container-fluid'>
            <Link to='/' className='navbar-brand' component={IndexLink}>
              Repauto
            </Link>
            <ul className='nav navbar-nav'>
              {projectList}
            </ul>
            {navPanel}
            {infoPanel}
          </div>
        </div>
      );
    }
  }
