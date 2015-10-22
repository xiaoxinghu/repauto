import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
@connect(
  state => ({projects: state.project.all})
)
export default class Trend extends Component {
  render() {
    const { projectId } = this.props.params;
    return (
      <div>
        <h1>Project Trend {projectId}</h1>
      </div>
    );
  }
}
