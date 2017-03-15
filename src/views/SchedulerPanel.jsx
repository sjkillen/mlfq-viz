/**
 * Render the Scheduler Panel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import "./SchedulerPanel.scss";


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
   return {
      /**
       * Scales x values to fit within queues
       */
      queue: d3.scaleBand().domain(scheduler.queues.map((q, i) => i))
         .range([0, svg.attr("width")]),
      // Takes job's queue position and outputs its y position
      queueOrder: d3.scaleLinear().domain([
         0, d3.max(scheduler.queues.map(q => q.jobs.length))
      ]).range([0, svg.attr("height")]),
      jobSize: () => "30px"
   };
}

/**
 * Get the position of a job in it's queue
 */
function getJobPosition(job, scheduler) {
   return scheduler.queues[job.running.priority].jobs.indexOf(job);
}

/**
 * Draw the scheduler's queues and the jobs inside them
 * @param element to draw the queues inside
 * @param scheduler
 * @param scales from getScales
 */
function drawJob(selection, scheduler, scales) {
   return selection
      .attr("cx", d => scales.queue(d.running.priority))
      .attr("r", d => 30 + "px")
      .attr("fill", d => d.running.ioLeft > 0 ? "yellow" : "red")
      .attr("style", "transition:cx 0.1s linear, cy 0.1s linear")
      .attr("cy", d => scales.queueOrder(getJobPosition(d, scheduler)));
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
