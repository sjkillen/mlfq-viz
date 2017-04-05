import dispatcher from "./dispatcher";

export const actions = {
   UPDATE_SCHEDULER: Symbol("UPDATE_SCHEDULER"),
   SELECT_JOB: Symbol("SELECT_JOB"),
   SET_JOB_FILL: Symbol("SET_JOB_FILL"),
   SET_PLAYBACK: Symbol("SET_PLAYBACK"),
   UNSTEP: Symbol("UNSTEP")
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

export const playback = {
   paused: Symbol("paused"),
   playing: Symbol("playing"),
   restarting: Symbol("restarting"),
   stepping: Symbol("stepping")
};

/**
 * Wait until a step has played and then go back to paused mode 
 */
export function unstepping(delay) {
   setTimeout(() => {
      dispatcher.dispatch({
         type: actions.UNSTEP
      });
   }, delay);
}

/**
 * Set the playback mode of the scheduler
 * @param mode (see above)
 */
export function setPlayback(mode) {
   dispatcher.dispatch({
      type: actions.SET_PLAYBACK,
      data: mode
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