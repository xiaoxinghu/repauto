import React, {Component, PropTypes} from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { invalidate } from '../../modules/TestRun';
import { invalidateTrend } from '../../modules/Project';
import _ from 'lodash';

@connect(
  state => ({
    a: state.router.params.projectId }),
  {pushState}
)
  export default class About extends Component {
    render() {
      const { id } = this.props;
      return (
        <div id={id} className="modal fade" tabindex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Repauto</h4>
              </div>
              <div className="modal-body">
                <p>Hello Repauto User.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
