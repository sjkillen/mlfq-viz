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
      const maxQueueHeight = scheduler.allJobs.length;
      const marginBottom = 100;
      const marginSides = 100;
      const svgHeight = svg.attr("height");
      //Scales x values to fit within queues
      const jobHeight = d3.scaleBand()
            .domain(d3.range(maxQueueHeight))
            .range([svgHeight - marginBottom, 0]);
      const queueWidth = jobHeight.bandwidth();
      const radius = queueWidth / 2;
      const queue = d3.scaleBand()
            .domain(d3.range(scheduler.numQueues))
            .range([marginSides, (scheduler.numQueues * queueWidth) + marginSides])
      const jobQueue = queue.paddingInner(5);
      return {
            queue,
            jobQueue,
            queueWidth,
            radius,
            width: 700,
            height: 700,
            cpu: {
                  x: marginSides + radius * 2.5,
                  y: svgHeight - marginBottom + radius * 2.5
            },
            finished: () => 0,
            // Takes job's queue position and outputs its y position
            queueOrder: jobHeight
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
            .attr("r", d => scales.radius + "px")
            .attr("fill", d => {
                  if (scheduler.cpuJob && d.init.id === scheduler.cpuJob.init.id) {
                        return "yellow";
                  } else if (d.running.isFinished) {
                        return "black";
                  } else if (d.running.ioLeft > 0) {
                        return "orange";
                  } else {
                        return "red";
                  }
            })
            .attr("style", "transition:cx 0.1s linear, cy 0.1s linear")
            .attr("cx", d => {
                  const pos = getJobPosition(d, scheduler);
                  if (Number.isFinite(pos)) {
                        return scales.jobQueue(d.running.priority)
                  } else if (d.running.isFinished) {
                        return 0;
                  } else if (d.running.ioLeft > 0) {
                        return scales.cpu.x - 50;
                  } else {
                        return scales.cpu.x;
                  }
            })
            .attr("cy", d => {
                  const y = scales.queueOrder(getJobPosition(d, scheduler));
                  if (Number.isFinite(y)) {
                        return y;
                  } else if (d.running.isFinished) {
                        return scales.cpu.y;
                  } else if (d.running.ioLeft > 0) {
                        return scales.cpu.y + 20;
                  } else {
                        return scales.cpu.y;
                  }
            });
}

/**
 * Draw the queues to hold jobs
 * @param {*} svg 
 * @param {*} width 
 * @param {*} height 
 */
function queues(svg, scheduler, scales) {
      const join = svg.selectAll("rect").data([scheduler.queues]);
      join.enter()
            .append("rect")
            .attr("width", 500)
            .attr("height", 500)
            .attr("x", 0)
            .attr("y", 0)
      join.exit().remove();
}

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
