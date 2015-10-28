import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { TrendCard } from '../../components';
import { fetchTrend } from '../../modules/Project';
import _ from 'lodash';

@connect(
  state => ({
    project: state.project.data[state.router.params.projectId],
    trends: state.project.trends
  }),
  {fetchTrend}
)
export default class Summary extends Component {
  componentDidMount() {
    const {fetchTrend, project} = this.props;
    if (project) {
      for (let run of project.run_names) {
        fetchTrend(run);
      }
    }
  }

  componentDidUpdate() {
    const {fetchTrend, project} = this.props;
    if (project) {
      for (let run of project.run_names) {
        fetchTrend(run);
      }
    }
  }

  render() {
    const {project, trends} = this.props;
    var content = (<div></div>);
    const cards = _.keys(trends).map((name) => {
      return (
        <div key={_.uniqueId('trend')} className='col-md-3'>
          <TrendCard title={name} data={trends[name]} />
        </div>
      )
    });
    if (project) {
      content = (
        <div id='ProjectSummary'>
          <div className='page-header'>
            <h2>{project.name}</h2>
            <p>summary view</p>
          </div>
          <div className='container-fluid'>
            <div className='row'>
              {cards}
            </div>
          </div>
        </div>
      );
    }
    return content;
  }
}
