/**
 * Handles application routing and places views
 */

import SchedulerPanel from "../views/SchedulerPanel";
import TableView from "./TableView";
import React, { Component } from "react";
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory,  } from "react-router";
import Header from "./Header";

class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Header}>
          <IndexRoute component={TableView} />
          <Route path="/Scheduler" component={SchedulerPanel} />
          <Route path="/Henry" component={HenrysComponent} />
        </Route>
      </Router>
    );
  }
}
const HenrysComponent = () => <div>Hello Henry! make sure to import your component!</div>;
export default App;