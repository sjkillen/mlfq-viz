/**
 * Adds some useful globals for debugging
 * No need to include in production
 */

import scheduler from "./scheduler";

/**
 * Print a summary of the scheduler
 * @global getStatus
 */
export function getStatus() {
   console.log(
      `CPU: ${scheduler.cpuJob ? "YES" : "NO"}
Futures: ${scheduler.futureJobs.size}
Finished: ${scheduler.finishedJobs.size}
IO: ${scheduler.ioJobs.size}
`
   )
   for (let i = 0; i < scheduler.numQueues; i++) {
      console.log(`Queue ${i}: ${scheduler.queues[i].jobs.length}`);
   }
}
window.getStatus = getStatus;

/**
 * Tell what state(s) a job is in
 * useful for determining whether a job is accidentily in multiple
 * states
 * @global getJobStates
 * @param {Job} job to test
 * @returns {string[]} states
 */
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

/**
 * Get the id of a job
 */
export function jid(job) {
      return job.init.id;
}
window.jid = jid;