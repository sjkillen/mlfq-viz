/**
 * Handles application routing and places views
 */

import SchedulerPanelContainer from "../containers/SchedulerPanelContainer";
import navBar from "./NavBar";
import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={SchedulerPanelContainer} />
        <Route path='/Henry' component={HenrysComponent} />
      </Router>
    )
  }
}
const HenrysComponent = () => <div>Hello Henry! make sure to import your component!</div>
export default App