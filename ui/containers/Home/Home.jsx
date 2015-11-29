import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { invalidate } from '../../modules/TestRun';
import { invalidateTrend } from '../../modules/Project';
import { ProjectMini } from '../../components';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import _ from 'lodash';

@connect(
    state => ({
      projects: state.project.data
    }),
    { pushState, invalidate, invalidateTrend }
)
export default class Home extends Component {
  // componentDidMount() {
  //   const { fetchSumamry, projects } = this.props;
  //   _.keys(projects).forEach((id) => {
  //     fetchSumamry(id);
  //   });
  // }

  _genGroup(projects) {
    const list = projects.map((project) => {
      return (
        <ProjectMini key={_.uniqueId('project_mini')}
                     project={project}
                     onRowClick={(e) => this._jumpToProject(project.id)} />
      );
    });
    return (
      <ListGroup>
        {list}
      </ListGroup>
    );
  }

  _jumpToProject(id) {
    console.info('jump', id);
    const { pushState, invalidate, invalidateTrend } = this.props;
    invalidate();
    invalidateTrend();
    pushState(null, `/projects/${id}`);
  }

  render() {
    const {projects} = this.props;
    const grouped = _.groupBy(_.values(projects), 'stream');
    let content = [];
    for (let stream in grouped) {
      content.push(
        <h3 key={_.uniqueId('stream')}>{stream}</h3>
      );
      content.push(this._genGroup(grouped[stream]));
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}
