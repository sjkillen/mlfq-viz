/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { updateScheduler, actions } from "./SchedulerActions";
import dispatcher from "./dispatcher";
import { immutInstance } from "../util";
import { fromJS as immut } from "immutable";
import Scheduler from "../mlfq";

/**
 * MUST BE FOR EVERY REDUCE CASE EXCEPT UPDATE_SCHEDULER
 * (SEE SELECT_JOB)
 * Since view animations depend on scheduler.speed
 * to know how long they must last, if an action fires
 * mid animation the animation timer will also reset
 * 
 * This function adjusts scheduler.speed (only for views)
 * to fix this problem
 * 
 * @param state from reduce function
 */
function adjustSpeed(state) {
      const timeDelta = performance.now() - state.get("lastUpdate");
      const newSpeed = state.getIn(["scheduler", "speed"]) - timeDelta;
      debugger;
      return state.setIn(["scheduler", "speed"], newSpeed);
}

class SchedulerStore extends ReduceStore {
   getInitialState() {
      scheduler.generateJobs();
      scheduler.play(scheduler => {
         updateScheduler(scheduler);
      });
      const prev = setStates(scheduler, {})
      return immut({
         scheduler: freezeSched(scheduler),
         prevJobStates: prev,
         selectedJobId: -1,
         lastUpdate: performance.now()
      });
   }
   getScheduler() {
      const state = this.getState();
      const scheduler = state.get("scheduler").toJS();
      scheduler.selectedJobId = state.get("selectedJobId");
      return scheduler;
   }
   reduce(state, action) {
      switch (action.type) {
         case actions.UPDATE_SCHEDULER: {
            const scheduler = action.data;
            const prev = setStates(scheduler, state.get("prevJobStates").toJS());
            return state
            .set("scheduler", freezeSched(scheduler))
            .set("prevJobStates", prev)
            .set("lastUpdate", performance.now())
         }
         case actions.SELECT_JOB: {
               return adjustSpeed(state.set("selectedJobId", action.data.init.id))
         }
         default:
            return state;
      }
   }
}

function freezeSched(s) {
   const { allJobs, simulationFinished } = s;
   return immutInstance(s).toMap().merge({ allJobs, simulationFinished });
}

function setStates(scheduler, prevStates) {
   const prevJobStates = {};
   function set(jobs, state) {
      jobs.forEach(job => {
         job.state = state;
         job.prevState = prevStates[job.init.id] || "future";
         prevJobStates[job.init.id] = state;
      });
   }
   set(scheduler.ioJobs, "io");
   set(scheduler.futureJobs, "future");
   set(scheduler.finishedJobs, "finished");
   scheduler.queues.forEach(queue => {
      set(queue.jobs, "waiting");
   });
   if (scheduler.cpuJob) {
      set([scheduler.cpuJob], "cpu");
   }
   return immut(prevJobStates);
}

export default new SchedulerStore(dispatcher);