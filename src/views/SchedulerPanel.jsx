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
      .data(scheduler.allJobs, d => d.init.id)
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
   const maxQueueHeight = 6;
   const marginBottom = 100;
   const marginSides = 100;
   //Scales x values to fit within queues
   const height = d3.scaleBand()
      .domain(d3.range(maxQueueHeight))
      .range([svg.attr("height") - marginBottom, 0]);
   const radius = height.bandwidth() / 2;
   const queue = d3.scaleBand()
      .domain(d3.range(scheduler.numQueues))
      .range([marginSides, (scheduler.numQueues * radius * 2) + marginSides]);
   return {
      queue,
      radius,
      // Takes job's queue position and outputs its y position
      queueOrder: height
   };
}

/**
 * Get the position of a job in it's queue
 * @param job 
 * @param scheduler 
 * @returns the position of the job in it's queue or Infinity if job is not in queue
 */
function getJobPosition(job, scheduler) {
   const position = scheduler.queues[job.running.priority].jobs.map(
      j => j.init.id)
      .indexOf(job.init.id);
   if (position === -1) {
      return Infinity;
   }
   return position;
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
      .attr("r", d => scales.radius + "px")
      .attr("fill", d => {
         if (scheduler.cpuJob && d.init.id === scheduler.cpuJob.init.id) {
            return "yellow";
         }
         if (d.running.isFinished) {
            return "black";
         }
         return "red";
      })
      .attr("style", "transition:cx 0.1s linear, cy 0.1s linear")
      .attr("cy", d => {
         let i = getJobPosition(d, scheduler);
         i = scales.queueOrder(i);
         return Number.isFinite(i) ? i : 0;
      });
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
