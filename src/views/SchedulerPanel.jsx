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
         <svg
            shapeRendering="geometricPrecision"
            ref={(el) => update(el, scheduler)}
            className="image">
         </svg>
      </span>
   );
}

/**
 * Performs the d3 lifecycle for jobs
 */
function jobLife(svg, scheduler, scales) {
   const jobJoin = svg
      .selectAll("g.job")
      .data(scheduler.allJobs, d => d.init.id)
   jobJoin
      .call(drawJob, scheduler, scales)
   jobJoin
      .call(jobClockFillSet, scales);
   const group = jobJoin.enter()
      .append("g")
      .classed("job", true)
   group.append("circle")
      .on("click", selectJob)
   group.call(drawJob, scheduler, scales)
   group.append("path")
      .classed("clockfill", true)
      .call(jobClockFillSet, scales);
   jobJoin.exit().remove();
   return jobJoin;
}

/**
 * Generate all the needed scales
 */
function getScales(svg, scheduler) {

   const timerScales = scheduler.queues.forEach(q => {
      return d3.scaleLinear()
         .domain([0, q.timeQuantum])
         .range([0, 2 * Math.PI])
   });
   const timer = job => timerScales[job.running.priority](job.running.quantumLeft)

   const maxQueueHeight = 7;
   const marginBottom = 200;
   const marginTop = 150;
   const marginSides = 400;
   const width = 1200;
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
      x: marginSides + queueWidth * 2,
      y: height - marginBottom + queueWidth * 2,
      textX: marginSides + queueWidth * 3,
      tickTextX: marginSides + queueWidth * 5.5
   };
   const queueBottom = jobHeight(0) + radius + queuePad;
   const queueHeight = queueBottom - queueTop;
   const drawQueue = p => queue(p) - (queueWidth + queuePad) / 2;
   const requeue = {
      upperPipeJob: queueTop - radius,
      sidePipeJob: queue(scheduler.numQueues - 1) + queueWidth,
      lowerPipeJob: cpu.y + queueWidth + radius,
      lowerWidth: queue(scheduler.numQueues - 1) + queueWidth * 2 - marginSides,
      lowerHeight: queueWidth,
      lowerLeft: drawQueue(0),
      lowerUp: cpu.y + queueWidth,
      middleUp: queueBottom,
      upperUp: queueTop - queueWidth,
      middleJobUp: queueBottom + radius,
      rightLeftStart: queue(scheduler.numQueues - 1) + queueWidth - radius,
      rightUpStart: queueTop,
      leftJob: queue(0),
      rightWidth: queueWidth,
      rightHeight: queueHeight + queueWidth * 4,
      leftHeight: (cpu.y + queueWidth) - queueBottom
   };
   const io = {
      up: requeue.middleUp,
      left: requeue.lowerLeft - queueWidth * 5,
      height: requeue.leftHeight + queueWidth,
      width: queueWidth * 5,
      textX: requeue.lowerLeft - queueWidth * 3,
      textY: requeue.middleUp + queueWidth,
      jobY: cpu.y,
      jobX: requeue.lowerLeft - queueWidth * 3,
   }
   const dead = {
      exit: requeue.sidePipeJob + radius * 3
   }
   return {
      // x Position a queue needs to be draw
      queue: drawQueue,
      // x Position a job in queue needs to be drawn
      jobQueue: queue,
      queueWidth: queueWidth + queuePad,
      queueHeight,
      queueBottom,
      queueTop,
      radius,
      width,
      height,
      cpu,
      io,
      timer,
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
 * Encodes a timer inside a circle, for TQs
 * @param {d3 selection} job element to fill 
 * @param scheduler 
 * @param scales 
 */
function jobClockFillSet(group, scales) {
   const context = d3.path();
   context.arc(0, 0, scales.radius * 0.5, 0, 2 * Math.PI);
   return group.select("path.clockfill")
      .attr("d", context.toString())
      .attr("fill", "blue")
}

/**
 * Draw the scheduler's queues and the jobs inside them
 * @param element to draw the queues inside
 * @param scheduler
 * @param scales from getScales
 */
function drawJob(selection, scheduler, scales) {
   selection.selectAll("circle").attr("r", d => scales.radius + "px")
   return selection
      .attr("data-state", d => d.state)
      .attr("data-selected", function (d) {
         if (d.init.id === scheduler.selectedJobId) {
            // Move job to front
            this.parentNode.appendChild(this);
            return true;
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
            case "cpu|io":
               job.call(anim.enterIO, scheduler, scales);
               return;
            case "io|waiting":
               job.call(anim.leaveIO, scheduler, scales, y);
               return;
            case "io|cpu":
               job.call(anim.leaveIOToCPU, scheduler, scales);
               return;
         }
      });
}

/**
 * Draw the queues to hold jobs
 */
function queues(svg, scheduler, scales) {
   const join = svg.selectAll("rect.queue").data(scheduler.queues);
   join.enter()
      .append("rect")
      .classed("queue", true)
      .attr("width", scales.queueWidth)
      .attr("height", scales.queueHeight)
      .attr("x", d => scales.queue(d.priority))
      .attr("y", scales.queueTop)
   join.exit().remove();
}

/**
 * Draw the pipe that requeues jobs and the one from queue to cpu
 */
function requeuePipe(svg, scheduler, scales) {
   const join = svg.selectAll("rect.requeue").data([1]).enter();
   join.append("rect")
      .classed("requeue", true)
      .attr("width", scales.requeue.lowerWidth)
      .attr("height", scales.requeue.lowerHeight)
      .attr("x", scales.requeue.lowerLeft)
      .attr("y", scales.requeue.lowerUp)
   join.append("rect")
      .classed("requeue", true)
      .attr("width", scales.requeue.lowerWidth)
      .attr("height", scales.requeue.lowerHeight)
      .attr("x", scales.requeue.lowerLeft)
      .attr("y", scales.requeue.middleUp)
   join.append("rect")
      .classed("requeue", true)
      .attr("width", scales.requeue.lowerWidth)
      .attr("height", scales.requeue.lowerHeight)
      .attr("x", scales.requeue.lowerLeft)
      .attr("y", scales.requeue.upperUp)
   join.append("rect")
      .classed("requeue", true)
      .attr("width", scales.requeue.rightWidth)
      .attr("height", scales.requeue.rightHeight)
      .attr("x", scales.requeue.rightLeftStart)
      .attr("y", scales.requeue.rightUpStart)
   join.append("rect")
      .classed("requeue", true)
      .attr("width", scales.requeue.rightWidth)
      .attr("height", scales.requeue.leftHeight)
      .attr("x", scales.requeue.lowerLeft)
      .attr("y", scales.requeue.middleUp)
}

/**
 * Draw the CPU
 */
function cpu(svg, scheduler, scales) {
   const update = svg.selectAll("g.cpu").data([1])
   const enter = update.enter()
      .append("g")
      .classed("cpu", true)

   enter.append("text")
      .classed("title", true)
      .attr("x", scales.cpu.textX)
      .attr("y", scales.cpu.y)
      .text("CPU")

   enter.append("text")
      .classed("tick", true)
      .attr("x", scales.cpu.tickTextX)
      .attr("y", scales.cpu.y)
      .text(scheduler.globalTick)

   enter.append("circle")
      .classed("slot", true)
      .attr("cx", scales.cpu.x)
      .attr("cy", scales.cpu.y)
      .attr("r", scales.radius)

   update.selectAll(".tick")
      .text(scheduler.globalTick)

}

/**
 * Draw the IO area for jobs in io
 */
function io(svg, scheduler, scales) {
   const update = svg.selectAll("g.io").data([1])
   const enter = update.enter()
      .append("g")
      .classed("io", true)

   enter.append("rect")
      .classed("box", true)
      .attr("x", scales.io.left)
      .attr("y", scales.io.up)
      .attr("width", scales.io.width)
      .attr("height", scales.io.height)

   enter.append("text")
      .classed("title", true)
      .attr("x", scales.io.textX)
      .attr("y", scales.io.textY)
      .text("IO")
}
/**
 * Update the drawing
 */
function update(svgElement, scheduler) {
   if (!svgElement) return;
   const svg = d3.select(svgElement);
   const scales = getScales(svg, scheduler);
   svg.attr("height", scales.height)
      .attr("width", scales.width)
      .attr("style", `transform: translate(-${scales.width / 2}px, 0)`);
   svg.call(requeuePipe, scheduler, scales);
   svg.call(queues, scheduler, scales);
   svg.call(cpu, scheduler, scales);
   svg.call(io, scheduler, scales);
   svg.call(jobLife, scheduler, scales);
}
