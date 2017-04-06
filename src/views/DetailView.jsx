/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import dispatcher from "../data/dispatcher";
import { fromJS as immut } from "immutable";
import { actions as lessonActions } from "../data/lessons";
import "./DetailView.scss";

export default Container.createFunctional(DetailView, () => [SchedulerStore], () => {
   const scheduler = SchedulerStore.getScheduler();
   return {
      select: scheduler.allJobs[scheduler.selectedJob] || null,
      scheduler
   };
});
/**
 * Called every state change
 */
function DetailView({ select, scheduler }) {
   return (
      <div className="DetailView">
         Hi! I'm details view
         <svg ref={el => update(el, scheduler, select)} className="preview">
         </svg>
      </div>
   );
}

function update(svg, scheduler, select) {

}