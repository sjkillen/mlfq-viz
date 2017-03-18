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

class SchedulerStore extends ReduceStore {
   getInitialState() {
      scheduler.generateJobs();
      scheduler.play(scheduler => {
         updateScheduler(scheduler);
      });
      const prev = setStates(scheduler, {})
      return immut({
         scheduler: freezeSched(scheduler),
         prevJobStates: prev
      });
   }
   getScheduler() {
      return this.getState().get("scheduler").toJS();
   }
   reduce(state, action) {
      switch (action.type) {
         case actions.UPDATE_SCHEDULER: {
            const scheduler = action.data;
            const prev = setStates(scheduler, state.get("prevJobStates").toJS());
            return state.set("scheduler", freezeSched(scheduler)).set("prevJobStates", prev);
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