/**
 * Render the Scheduler Panel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import "./SchedulerPanel.scss";
import * as anim from "./schedulerAnimations";
import { selectJob } from "../data/SchedulerActions";

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
      .classed("job", true)
      .on("click", selectJob)
      .call(drawJob, scheduler, scales);
   jobJoin.exit().remove();
   return jobJoin;
}

/**
 * Generate all the needed scales
 */
function getScales(svg, scheduler) {
   const maxQueueHeight = scheduler.allJobs.length > 8 ? 8 : scheduler.allJobs.length;
   const marginBottom = 200;
   const marginTop = 150;
   const marginSides = 100;
   const width = 700;
   const height = 700;
   const queuePad = 5;
   const jobPad = 5;
   const jobHeight = d3.scaleBand()
      .domain(d3.range(maxQueueHeight))
      .range([height - marginBottom, marginTop]);
   const queueWidth = jobHeight.bandwidth();
   const radius = queueWidth / 2;
   const queueTop = jobHeight(maxQueueHeight - 1) - radius;
   const queue = d3.scaleBand()
      .domain(d3.range(scheduler.numQueues))
      .range([marginSides, (scheduler.numQueues * queueWidth) + marginSides])
   const jobQueue = queue.paddingInner(jobPad);
   const cpu = {
      x: marginSides + radius * 2.5,
      y: height - marginBottom + radius * 2.5
   };
   const requeue = {
      upperPipeJob: queueTop - radius,
      sidePipeJob: queue(scheduler.numQueues - 1) + queueWidth,
      lowerPipeJob: cpu.y + radius * 2
   };
   const dead = {
      exit: requeue.sidePipeJob + radius * 3
   }
   return {
      // x Position a queue needs to be draw
      queue: p => queue(p) - (queueWidth + queuePad) / 2,
      // x Position a job in queue needs to be drawn
      jobQueue: queue,
      queueWidth: queueWidth + queuePad,
      queueBottom: jobHeight(0) + radius + queuePad,
      queueTop,
      radius,
      width,
      height,
      cpu,
      dead,
      requeue,
      finished: () => 0,
      // Takes job's queue position and outputs its y position
      queueOrder: jobHeight
   };
}

/**
 * Get the array that contains a job
 */
function getJobHolster(job, scheduler) {
   switch (job.state) {
      case "waiting":
      case "cpu":
         return scheduler.queues[job.running.priority].jobs;
      case "future":
         return scheduler.futureJobs;
      case "io":
         return scheduler.ioJobs;
      case "finished":
         return scheduler.finishedJobs;
      default:
         throw new Error("no holster");
   }
}

/**
 * Get the position of a job in it's queue
 * @param job 
 * @param scheduler 
 * @returns the position of the job in it's queue (future, io, waiting, cpu)
 */
function getJobPosition(job, scheduler) {
   const holster = getJobHolster(job, scheduler);
   const position = holster.map(
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
      .attr("r", d => scales.radius + "px")
      .attr("fill", d => {
         if (d.init.id === scheduler.selectedJobId) {
            return "blue";
         }
         switch (d.state) {
            case "cpu":
               return "yellow";
            case "future":
               return "white";
            case "finished":
               return "black";
            case "io":
               return "orange";
            case "waiting":
               return "red";
         }
      })
      .each(function (d) {
         // Job animations get messed up if redrawn mid animation
         if (!scheduler.changed) return;
         const pos = getJobPosition(d, scheduler);
         const y = scales.queueOrder(pos);
         const job = d3.select(this);

         switch (d.prevState + "|" + d.state) {
            case "future|future":
               job.call(anim.waitInFuture, scheduler, scales);
               return;
            case "future|waiting":
               job.call(anim.enterSimulation, scheduler, scales, y);
               return;
            case "future|cpu":
               job.call(anim.enterSimulationToCPU, scheduler, scales, y);
               return;
            case "waiting|waiting":
               job.call(anim.queueMove, scheduler, scales, y);
               return;
            case "waiting|cpu":
               job.call(anim.queueToCPU, scheduler, scales);
               return;
            case "cpu|finished":
               job.call(anim.finishJob, scheduler, scales);
               return;
            case "cpu|waiting":
               job.call(anim.requeueJob, scheduler, scales, y);
               return;
         }
         if (d.running.ioLeft > 0) {
            job.attr("cy", scales.cpu.y + 20);
            job.attr("cx", scales.cpu.x - 50);
         }
      })
}

/**
 * Draw the queues to hold jobs
 */
function queues(svg, scheduler, scales) {
   const join = svg.selectAll("rect").data(scheduler.queues);
   join.enter()
      .append("rect")
      .attr("width", scales.queueWidth)
      .attr("height", scales.queueBottom - scales.queueTop)
      .attr("x", d => scales.queue(d.priority))
      .attr("y", scales.queueTop)
   join.exit().remove();
}

/**
 * Draw the pipe that requeues jobs
 */
function requeuePipe(svg, scheduler, scales) {
   const join = svg.selectAll("rect").data([1]).enter()
   join.append("rect")
      .attr("width", scales.queueWidth)
      .attr("height", scales.queueBottom - scales.queueTop)
      .attr("x", d => scales.queue(d.priority))
      .attr("y", scales.queueTop)
   join.exit().remove();
}

/**
 * Update the drawing
 */
function update(svgElement, scheduler) {
   if (!svgElement) return;
   const svg = d3.select(svgElement)
   const scales = getScales(svg, scheduler);
   svg.attr("height", scales.height)
      .attr("width", scales.width)
      .attr("style", `transform: translate(-${scales.width / 2}px, 0)`);
   svg.call(queues, scheduler, scales)
   svg.call(jobLife, scheduler, scales);
}
