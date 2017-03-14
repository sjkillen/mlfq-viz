/**
 * Render the Scheduler Panel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";

export default Container.createFunctional(SchedulerPanel, () => [SchedulerStore], () => {
   return SchedulerStore.getScheduler();
});

/**
 * Called every state change
 */
function SchedulerPanel(scheduler) {
   return (
      <span className="SchedulerPanel">
         <svg ref={(el) => update(el, scheduler)} className="image">
         </svg>
      </span>
   );
}

/**
 * Performs the d3 lifecycle for jobs
 */
function jobLife(svg, scheduler, scales) {
   const jobJoin = svg
      .selectAll("circle")
      .data([].concat(scheduler.allJobs), d => d.init.id)
      .call(drawJob, scheduler, scales);
   jobJoin.enter()
      .append("circle")
      .call(drawJob, scheduler, scales);
   jobJoin.exit()
      .attr("fill", "black")
      .attr("cy", svg.attr("height") - 50);
   return jobJoin;
}

/**
 * Generate all the needed scales
 */
function getScales(svg, scheduler) {
   const service = d3.scaleLinear()
         .domain([0, 1])
         .range([0, svg.attr("height")]);

   return {
      future: d3.scaleLinear().domain([
         0,
         scheduler.config.jobCreateTimeRange[1]
      ]).range([0, svg.attr("width")]),
      service,
      size: d3.scaleLinear()
         .domain([0, scheduler.numQueues])
         .range([30, 4]),
      jobHeight: d => service(d.running.serviceTime / d.init.runTime)
   };
}

/**
 * Draw the scheduler's queues and the jobs inside them
 * @param element to draw the queues inside
 * @param scheduler
 */
function drawJob(selection, scheduler, scales) {
   return selection
      .attr("cx", d => scales.future(d.init.createTime))
      .attr("r", d => scales.size(d.running.priority) + "px")
      .attr("fill", d => d.running.ioLeft > 0 ? "yellow" : "red")
      .attr("style", "transition:cy 0.1s linear")
      .attr("cy", scales.jobHeight);
}

function update(svgElement, scheduler) {
   if (!svgElement) return;
   const width = 600, height = 500;
   const svg = d3.select(svgElement)
      .attr("height", height)
      .attr("width", width);

   const scales = getScales(svg, scheduler);

   svg.call(jobLife, scheduler, scales);
}
