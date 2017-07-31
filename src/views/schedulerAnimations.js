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

function transXY(select, x, y) {
   select.each(d => {
      if (typeof x === "function") x = x(d);
      if (typeof y === "function") y = y(d);
      return select.attr("transform", `translate(${x}, ${y})`);
   })
}


/**
 * Animate a job moving from it's queue to the CPU
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function queueToCPU(job, scheduler, scales) {
   const time = scheduler.speed;
   return job.transition(linear(time, 0.25))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.requeue.middleJobUp)
      .transition(linear(time, 0.25))
      .call(transXY, scales.requeue.leftJob, scales.requeue.middleJobUp)
      .transition(linear(time, 0.25))
      .call(transXY, scales.requeue.leftJob, scales.cpu.y)
      .transition(linear(time, 0.25))
      .call(transXY, scales.cpu.x, scales.cpu.y)
}

/**
 * Animate a job staying on the CPU
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function cpuToCPU(job, scheduler, scales) {
   const time = scheduler.speed;
   return job.transition(linear(time, 1))
      .call(transXY, scales.cpu.x, scales.cpu.y)
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
      .call(transXY, d => scales.jobQueue(d.running.priority), y)
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
      .call(transXY, scales.cpu.x, scales.requeue.lowerPipeJob)
      .transition(linear(time, 0.5))
      .call(transXY, scales.dead.exit, scales.requeue.lowerPipeJob)
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
      .call(transXY, scales.cpu.x, scales.requeue.lowerPipeJob)
      .transition(linear(time, 0.2))
      .call(transXY, scales.requeue.sidePipeJob, scales.requeue.lowerPipeJob)
      .transition(linear(time, 0.2))
      .call(transXY, scales.requeue.sidePipeJob, scales.requeue.upperPipeJob)
      .transition(linear(time, 0.2))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.requeue.upperPipeJob)
      .transition(linear(time, 0.2))
      .call(transXY, d => scales.jobQueue(d.running.priority), y)
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
      .call(transXY, d => scales.jobQueue(d.running.priority), y - scales.height)
      .transition(linear(time, 1))
      .call(transXY, d => scales.jobQueue(d.running.priority), y)
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
      .call(transXY, d => scales.jobQueue(d.running.priority), y - scales.height)
      .transition(linear(time, 1 / 3))
      .call(transXY, d => scales.jobQueue(d.running.priority), y)
      .transition(linear(time, 1 / 3))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.cpu.y)
      .transition(linear(time, 1 / 3))
      .call(transXY, scales.cpu.x, scales.cpu.y);
}

/**
 * Job that is waiting to enter the simulation
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function waitInFuture(job, scheduler, scales) {
   const time = scheduler.speed;
   return job.call(transXY, -30, -30)
}

/**
 * Job that has left cpu and entered IO
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function enterIO(job, scheduler, scales) {
   const time = scheduler.speed;
   return job
      .transition(linear(time, 1 / 4))
      .call(transXY, scales.requeue.leftJob, scales.cpu.y)
      .transition(linear(time, 1 / 4))
      .call(transXY,scales.requeue.leftJob, scales.requeue.lowerPipeJob)
      .transition(linear(time, 1 / 4))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.requeue.lowerPipeJob)
      .transition(linear(time, 1 / 4))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.requeue.lowerPipeJob + scales.queueWidth)
}

/**
 * Job that stays in IO for a cycle
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function IOtoIO(job, scheduler, scales) {
   const time = scheduler.speed;
   return job
      .transition(linear(time, 1))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.requeue.lowerPipeJob + scales.queueWidth)
}

/**
 * Job that has left io and reentered queue
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 * @param y position to move job to in queue
 */
export function leaveIO(job, scheduler, scales, y) {
   const time = scheduler.speed;
   return job
      .transition(linear(time, 1 / 5))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.requeue.lowerPipeJob)
      .transition(linear(time, 1 / 5))
      .call(transXY, scales.requeue.sidePipeJob, scales.requeue.lowerPipeJob)
      .transition(linear(time, 1 / 5))
      .call(transXY, scales.requeue.sidePipeJob, scales.requeue.upperPipeJob)
      .transition(linear(time, 1 / 5))
      .call(transXY, d => scales.jobQueue(d.running.priority), scales.requeue.upperPipeJob)
      .transition(linear(time, 1 / 5))
      .call(transXY, d => scales.jobQueue(d.running.priority), y)
}

/**
 * Job that has left io and was immediately put on cpu
 * @param job d3 selection of the job element
 * @param scheduler MLFQ
 * @param scales object containing d3-scales and constants
 */
export function leaveIOToCPU(job, scheduler, scales) {
   const time = scheduler.speed;
   return job
      .transition(linear(time, 1 / 7))
      .call(transXY, scales.requeue.leftJob, scales.io.jobY)
      .transition(linear(time, 1 / 7))
      .call(transXY, scales.requeue.leftJob, scales.requeue.lowerPipeJob)
      .transition(linear(time, 1 / 7))
      .call(transXY, scales.requeue.sidePipeJob, scales.requeue.lowerPipeJob)
      .transition(linear(time, 1 / 7))
      .call(transXY, scales.requeue.sidePipeJob, scales.requeue.upperPipeJob)
      .transition(linear(time, 1 / 7))
      .call(transXY, scales.jobQueue(0), scales.requeue.upperPipeJob)
      .transition(linear(time, 1 / 7))
      .call(transXY, scales.jobQueue(0), scales.cpu.y)
      .transition(linear(time, 1 / 7))
      .call(transXY, scales.cpu.x, scales.cpu.y)
}

