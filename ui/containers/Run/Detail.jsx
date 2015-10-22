import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
class Detail extends Component {
  render() {
    const { testRunId } = this.props.params;
    return (
      <div>
        Test Run Detail {testRunId}
      </div>
    );
  }
}

function select(state) {
  return {
    projects: state.project.all,
    active: state.project.active
  };
}

export default connect(select)(Detail);
