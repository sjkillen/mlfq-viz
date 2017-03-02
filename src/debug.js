/**
 * Adds some useful globals for debugging
 * Don't include in production
 */

import scheduler from "./scheduler";

export function getStatus() {
   console.log(
      `CPU: ${scheduler.cpuJob ? "YES" : "NO"}
      Futures: ${scheduler.futureJobs.length}
      Finished: ${scheduler.finishedJobs.length}`
   )
   for (let i = 0; i < scheduler.numQueues; i++) {
      console.log(`Queue ${i}: ${scheduler.queues[i].jobs.length}`);
   }
}
window.getStatus = getStatus;

export function getJobStates(job) {
   const states = [];
   if (scheduler.futureJobs.indexOf(job) !== -1) {
      states.push("Future");
   }
   if (scheduler.finishedJobs.indexOf(job) !== -1) {
      states.push("Finished");
   }
   if (scheduler.cpuJob === job) {
      states.push("CPU");
   }
   if (scheduler.ioJobs.indexOf(job) !== -1) {
      states.push("IO");
   }
   for (let i = 0; i < scheduler.numQueues; i++) {
      if (scheduler.queues[i].jobs.indexOf(job) !== -1) {
         states.push(`Queue ${i}`);
      }
   }
   return states;
}
window.getJobStates = getJobStates;