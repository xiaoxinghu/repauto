import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { NavBar, About } from '../../components';
import { fetch } from '../../modules/Project';

@connect(
    state => ({projects: state.project.data}),
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
        <About id="about"/>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
