/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import "../libs/d3.parcoords";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import PAStore from "../data/PAStore";
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


d3.parcoords = function(config) {
  var __ = {
    data: [],
    highlighted: [],
    dimensions: {},
    dimensionTitleRotation: 0,
    brushed: false,
    brushedColor: null,
    alphaOnBrushed: 0.0,
    mode: "default",
    rate: 20,
    width: 600,
    height: 300,
    margin: { top: 24, right: 0, bottom: 12, left: 0 },
    nullValueSeparator: "undefined", // set to "top" or "bottom"
    nullValueSeparatorPadding: { top: 8, right: 0, bottom: 8, left: 0 },
    color: "#069",
    composite: "source-over",
    alpha: 0.7,
    bundlingStrength: 0.5,
    bundleDimension: null,
    smoothness: 0.0,
    showControlPoints: false,
    hideAxis : [],
    flipAxes: [],
    animationTime: 1100, // How long it takes to flip the axis when you double click
    rotateLabels: false
  };
}
function update(svgElement, { scheduler, PAAttr }) {
   if (!svgElement) return;
    var data = [
    {name: "Asparagus", protein: 2.2, calcium: 0.024, sodium: 0.002},
    {name: "Butter", protein: 0.85, calcium: 0.024, sodium: 0.714},
    {name: "Coffeecake", protein: 6.8, calcium: 0.054, sodium: 0.351},
    {name: "Pork", protein: 28.5, calcium: 0.016, sodium: 0.056},
    {name: "Provolone", protein: 25.58, calcium: 0.756, sodium: 0.876}
    ];

    var filteredData = [];  // create empty array for filtered data

    var filteredDimensions = ['name', 'protein', 'sodium'];  // create filter 

    data.forEach( function (e,j) { 
        var temp ={};
        filteredDimensions.forEach ( function (d,i) {
            temp[d] = e[d]
        })
        filteredData.push(temp)
    })

    var pc = d3.parcoords()
    .data(filteredData)
    .render()
    .ticks(3)
    .createAxes();

}

