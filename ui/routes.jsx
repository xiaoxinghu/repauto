import React from 'react';
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter
} from 'redux-router';
import { Route, Link } from 'react-router';
import {
  App,
  Navbar,
  ProjectSummary,
  ProjectTrend,
  TestRunList,
  TestRunDetail
} from './containers';

export default () => {
  return (
    <ReduxRouter>
      <Route path="/" component={App}>
        <Route path="projects/:projectId" component={ProjectSummary} />
        <Route path="projects/:projectId/trend" component={ProjectTrend} />
        <Route path="projects/:projectId/runs" component={TestRunList} />
        <Route path="projects/:projectId/runs/:runId" component={TestRunDetail} />
      </Route>
    </ReduxRouter>
  );
}
