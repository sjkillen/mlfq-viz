import dispatcher from "./dispatcher";

export const actions = {
   UPDATE_SCHEDULER: Symbol("UPDATE_SCHEDULER")
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