/**
 * Handles application routing and places views
 */

import ScatterplotMatrix from "./ScatterplotMatrix";

import { Component } from "react";
import { BrowserRouter, Route, Switch, browserHistory } from "react-router-dom";


export default
class Navigation extends Component {
   render(props) {
      return (
         <BrowserRouter basename="/dist">
            <Switch>
               <Route path="/" component={ScatterplotMatrix} />
            </Switch>
         </BrowserRouter>
      );
   }
}