/**
 * D3 animations for the Scheduler Panel
 * All animations need to finish before scheduler.speed (ms)
 */

import * as d3 from "d3";

/**
 * Create a linear translation
 * @param {number} duration total animation length ms
 * @param {float(0, 1)} fraction multiplied by duration
 */
function linear(duration, fraction) {
   return d3.transition()
      .ease(d3.easeLinear)
      .duration(duration * fraction);
}

/**
 * Animate a job moving from it's queue to the CPU
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function queueToCPU(job, scheduler, scales) {
   const time = scheduler.speed;
   return job.transition(linear(time, 0.5))
      .attr("cy", scales.cpu.y)
      .transition(linear(time, 0.5))
      .attr("cx", scales.cpu.x);
}

/**
 * Animate a job inside a queue
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 * @param y position to move job to
 */
export function queueMove(job, scheduler, scales, y) {
   const time = scheduler.speed;
   return job
      .transition(linear(time, 1))
      .attr("cy", y)
      .attr("cx", d => scales.jobQueue(d.running.priority))
}

/**
 * Animate a job finishing and leaving the simulation
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function finishJob(job, scheduler, scales) {
   const time = scheduler.speed;
   return job
      .attr("opacity", 1)
      .transition(linear(time, 0.5))
      .attr("cy", scales.requeue.lowerPipeJob)
      .transition(linear(time, 0.5))
      .attr("cx", scales.dead.exit)
      .attr("opacity", 0)
}

/**
 * Place a job back in queue from cpu
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 * @param y position to move job to in queue
 */
export function requeueJob(job, scheduler, scales, y) {
   const time = scheduler.speed;
   return job
      .transition(linear(time, 0.2))
      .attr("cy", scales.requeue.lowerPipeJob)
      .transition(linear(time, 0.2))
      .attr("cx", scales.requeue.sidePipeJob)
      .transition(linear(time, 0.2))
      .attr("cy", scales.requeue.upperPipeJob)
      .transition(linear(time, 0.2))
      .attr("cx", d => scales.jobQueue(d.running.priority))
      .transition(linear(time, 0.2))
      .attr("cy", y)
}

/**
 * Enter the simulation from the future jobs
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 * @param y position to move job to in queue
 */
export function enterSimulation(job, scheduler, scales, y) {
   const time = scheduler.speed;
   return job
      .attr("cx", d => scales.jobQueue(d.running.priority))
      .attr("cy", y - scales.height)
      .transition(linear(time, 1))
      .attr("cy", y)
}

/**
 * Enter the simulation from the future jobs and go directly to the CPU
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function enterSimulationToCPU(job, scheduler, scales) {
   const time = scheduler.speed;
   const y = scales.queueOrder(0);
   return job
      .attr("cx", d => scales.jobQueue(d.running.priority))
      .attr("cy", y - scales.height)
      .transition(linear(time, 1 / 3))
      .attr("cy", y)
      .transition(linear(time, 1 / 3))
      .attr("cy", scales.cpu.y)
      .transition(linear(time, 1 / 3))
      .attr("cx", scales.cpu.x);
}

/**
 * Job that is waiting to enter the simulation
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function waitInFuture(job, scheduler, scales) {
   const time = scheduler.speed;
   return job
      .attr("cx", -30)
      .attr("cy", -30)
}