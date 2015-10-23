import React from 'react';
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter
} from 'redux-router';
import { Route, IndexRoute } from 'react-router';
import {
  App,
  Navbar,
  ProjectContext,
  ProjectSummary,
  ProjectTrend,
  TestRunList,
  TestRunDetail,
  NotFound,
} from './containers';
import { activateProject } from './redux/modules/project';

export default (store) => {
  return (
    <ReduxRouter>
      <Route path="/" component={App}>
        <Route path="projects/:projectId" component={ProjectContext}>
          <IndexRoute component={ProjectSummary} />
          <Route path="summary" component={ProjectSummary} />
          <Route path="trend" component={ProjectTrend} />
          <Route path="runs" component={TestRunList} />
          <Route path="runs/:runId" component={TestRunDetail} />
        </Route>
        <Route path="*" component={NotFound} status={404} />
      </Route>
    </ReduxRouter>
  );
}
