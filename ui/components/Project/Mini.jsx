import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { DonutChart } from '../../components';
import ClassNames from 'classnames';
import { fetchSumamry } from '../../modules/Project';
import helper from '../../helper';

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
    const { project } = this.props;
    const runs = project.run_names.map((name) => {
      return (
        <li>{name}</li>
      );
    });
    return (
      <a href='#' className='list-group-item' onClick={this._handleClick.bind(this)}>
        <h4 className='list-group-item-heading'>
          {project.name}
        </h4>
      </a>
    );
  }
}

