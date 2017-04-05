/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import SPLOMStore from "../data/PAStore";
import "./PAPanel.scss";

export default Container.createFunctional(PAPanel, () => [SchedulerStore, PAStore], () => {
   return {
         scheduler: SchedulerStore.getScheduler(),
         PAAttr: PAStore.getState().accessors
   }
});

/**
 * Called every state change
 */
function PAPanel(scheduler) {
   return (
      <span className="PAPanel">
         <svg ref={(el) => update(el, scheduler)} className="image3">
         </svg>
      </span>
   );
}



function update(svgElement, { scheduler, PAAttr }) {
   if (!svgElement) return;
    var data = [
    [0,-0,0,0,0,3 ],
    [1,-1,1,2,1,6 ],
    [2,-2,4,4,0.5,2],
    [3,-3,9,6,0.33,4],
    [4,-4,16,8,0.25,9]
    ];

   var pc = d3.parcoords()("#example")
            .data(data)
            .render()
            .createAxes();

}