import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { DonutChart } from '../../components';
import StatusBadge from '../StatusBadge/StatusBadge';
import ClassNames from 'classnames';
import { fetchSumamry } from '../../modules/Project';
import helper from '../../helper';
import _ from 'lodash';

@connect(
    state => ({summary: state.project.summary}),
    {fetchSumamry}
)
export default class ProjectMini extends Component {
  componentDidMount() {
    const { fetchSumamry, project } = this.props;
    fetchSumamry(project.id);
  }

  _handleClick(e) {
    e.preventDefault();
    this.props.onRowClick(e);
  }

  render() {
    const { project, summary } = this.props;
    const content = [
      <h4 key="title" className='list-group-item-heading'>
        {project.name}
      </h4>
    ];
    if (summary[project.id]) {
      const total = summary[project.id].ori;
      const runNumber = summary[project.id].total_runs;
      console.info("total", total);
      const avg = _.mapValues(total, (n) => {
        return Math.round(n / runNumber);
      });
      content.push(
        <dl key="status">
          <dt>Total</dt><dd><StatusBadge status={total} /></dd>
          <dt>Average</dt><dd><StatusBadge status={avg} /></dd>
        </dl>
      );
      content.push(
        <span>from last {runNumber} runs</span>
      );
    }
    return (
      <a className='list-group-item' onClick={this._handleClick.bind(this)}>
        {content}
      </a>
    );
  }
}

