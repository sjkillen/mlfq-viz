/**
 * Handles application routing and places views
 */

import SchedulerPanelContainer from "../containers/SchedulerPanelContainer";

import { Component } from "react";
import { BrowserRouter, Route, Switch, browserHistory } from "react-router-dom";


export default function Navigation(props) {
   return (
      <BrowserRouter basename="/dist">
         <Switch>
            <Route path="/" component={SchedulerPanelContainer} />
         </Switch>
      </BrowserRouter>
   );
}