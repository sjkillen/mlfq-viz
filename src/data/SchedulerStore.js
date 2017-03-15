/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { updateScheduler, actions } from "./SchedulerActions";
import dispatcher from "./dispatcher";
import { immutInstance } from "../util";
import Scheduler from "../mlfq";

class SchedulerStore extends ReduceStore {
   getInitialState() {
      function state(s) {
            const { allJobs, simulationFinished } = s;
            return immutInstance(s).toMap().merge({ allJobs, simulationFinished });
      }
      scheduler.generateJobs();
      scheduler.play(100, scheduler => {
         updateScheduler(state(scheduler));
      });
      return state(scheduler);
   }
   getScheduler() {
         const o = this.getState().toJS();
         return o;
   }
   reduce(state, action) {
      switch (action.type) {
         case actions.UPDATE_SCHEDULER:
            return action.data;
         default:
            return state;
      }
   }
}

export default new SchedulerStore(dispatcher);