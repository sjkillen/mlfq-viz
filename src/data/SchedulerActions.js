import dispatcher from "./dispatcher";

export const actions = {
   UPDATE_SCHEDULER: Symbol("UPDATE_SCHEDULER"),
   SELECT_JOB: Symbol("SELECT_JOB"),
   SET_JOB_FILL: Symbol("SET_JOB_FILL")
};

/**
 * Copies the state of the given scheduler to the store
 * @param {Scheduler} scheduler state to save
 */
export function updateScheduler(scheduler) {
   dispatcher.dispatch({
      type: actions.UPDATE_SCHEDULER,
      data: scheduler
   });
}

/**
 * Selects a job in the simulation
 * @param job to select
 */
export function selectJob(job) {
   dispatcher.dispatch({
      type: actions.SELECT_JOB,
      data: job
   });
}

/**
 * Set an attribute to be displayed inside jobs
 */
export function setJobFillAttribute(attr) {
   dispatcher.dispatch({
      type: actions.SET_JOB_FILL,
      data: attr
   });
}