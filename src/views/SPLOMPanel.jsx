/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";

export default Container.createFunctional(SPLOMPanel, () => [SchedulerStore], () => {
   return SchedulerStore.getState()
});

/**
 * Called every state change
 */
function SPLOMPanel(scheduler) {    
    
   return (
      <span className="SPLOMPanel">
         <svg ref={(el) => update(el, scheduler)} className="image2">
         </svg>
      </span>
   );
}

function update(svgElement, scheduler) {
   if (!svgElement) return;
   const width = 1800, height = 500;

   console.log(scheduler);
   
   
}