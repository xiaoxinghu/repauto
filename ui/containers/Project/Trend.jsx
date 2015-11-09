import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { TrendGraph, ProjectTrendControlPanel } from '../../components';
import { fetchTrend } from '../../modules/Project';
import _ from 'lodash';

@connect(
  state => ({
    project: state.project.data[state.router.params.projectId],
    trends: state.project.trend.data
  }),
  {fetchTrend}
)
export default class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      mode: 'proc',
      filter: 20
    };
  }

  _handleSwitchRun(run) {
    if (run != '') {
      this.props.fetchTrend(run);
    }
    this.setState({selected: run});
  }

  _handleSwitchMode(mode) {
    this.setState({mode: mode});
  }

  _handleFilterChange(filter) {
    this.setState({filter: filter});
  }

  render() {
    const {project, trends} = this.props;
    const {selected, mode, filter} = this.state;
    let runs = project ? project.run_names : [];
    let trendData = [];
    if (trends[selected]) {
      trendData = trends[selected].map((trend) => {
        return _.assign({}, trend[mode], {time: trend.time, total: _.sum(trend[mode])});
      });
      const max = _.max(trendData, 'total');
      trendData = _.filter(trendData, (d) => {
        return d.total > ( max.total * filter / 100 );
      });
    }
    return (
      <div className='row'>
        <div className='col-sm-3'>
          <ProjectTrendControlPanel
            runs={runs}
            selected={this.state.selected}
            mode={mode}
            filter={filter}
            onSwitchRun={run => this._handleSwitchRun(run)}
            onFilterChange={filter => this._handleFilterChange(filter)}
            onSwitchMode={mode => this._handleSwitchMode(mode)} />
        </div>
        <div className='col-sm-9'>
          <TrendGraph data={trendData} />
        </div>
      </div>
    );
  }
};
