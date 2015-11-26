import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import { Matrix } from '../../components';
import { fetchMatrix } from '../../modules/Project';
import helper from '../../helper';
import _ from 'lodash';

@connect(
  state => ({
    project: state.project.data[state.router.params.projectId],
    matrix: state.project.matrix.data[state.router.params.projectId]
  }),
  {fetchMatrix}
)
export default class MatrixView extends Component {
  componentDidMount() {
    this._fetchMatrix();
  }

  componentDidUpdate() {
    this._fetchMatrix();
  }

  _fetchMatrix() {
    const {fetchMatrix, project} = this.props;
    if (project) {
      console.info('fetchMatrix');
      fetchMatrix();
    }
  }

  handleClick(target) {
  }

  render() {
    const { matrix } = this.props;
    return (
      <div>
        <Matrix data={matrix}/>
      </div>
    );
  }
};
