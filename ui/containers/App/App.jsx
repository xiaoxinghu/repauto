import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { NavBar } from '../../components';
import { fetch } from '../../actions/project';

@connect(
    state => ({projects: state.project.all}),
    {fetch}
)
export default class App extends Component {
  componentDidMount() {
    const { fetch } = this.props;
    fetch();
  }

  render() {
    return (
      <div>
        <NavBar />
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
