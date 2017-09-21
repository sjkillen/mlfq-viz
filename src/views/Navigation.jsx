/**
 * Handles application routing and places views
 */
import SPLOMPanel from "../views/SPLOMPanel";
import PAPanel from "../views/PAPanel";
import SchedulerPanel from "../views/SchedulerPanel";
import TableView from "./TableView";
import React, { Component } from 'react';
import Header from "./Header";
import { Router } from "../data/FluxRouter";
import { deepFreeze } from "../util";

class App extends Component {
  render() {
    return (
      <span >
        <Header>
          <Router />
        </Header>
      </span >
    );
  }
}
export default App;

