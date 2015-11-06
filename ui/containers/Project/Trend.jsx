import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { TrendGraph } from '../../components';
import { fetchTrend } from '../../modules/Project';
import _ from 'lodash';

@connect(
  state => ({
    project: state.project.data[state.router.params.projectId],
    trends: state.project.trends
  }),
  {fetchTrend}
)
export default class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: ''};
  }

  _handleSwitchRun(e) {
    const run = e.target.value;
    if (run != '') {
      this.props.fetchTrend(run);
    }
    this.setState({selected: run});
  }

  render() {
    const {project, trends} = this.props;
    const {selected} = this.state;
    let run_names = project ? project.run_names : [];
    var types = run_names.map(function(t) {
      return (
        <option key={_.uniqueId('run')} value={t}>{t}</option>
      )
    });
    var panel = (
      <div>
        <select className="form-control" onChange={this._handleSwitchRun.bind(this)} value={selected}>
          <option key={_.uniqueId('type')} value=''>Select Run</option>
          {types}
        </select>
      </div>
    );
    let trendData = [];
    if (trends[selected]) {
      trendData = trends[selected].map((trend) => {
        return _.assign({}, trend.ori, {time: trend.time});
      });
    }
    return (
      <div className='row'>
        <div className='col-sm-3'>
          {panel}
        </div>
        <div className='col-sm-9'>
          <TrendGraph data={trendData} />
        </div>
      </div>
    );
  }
};
