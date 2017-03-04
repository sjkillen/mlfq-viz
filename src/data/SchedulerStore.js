/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { updateScheduler, actions } from "./SchedulerActions";
import dispatcher from "./dispatcher";
import { immutInstance } from "../util";


class SchedulerStore extends ReduceStore {
   getInitialState() {
      scheduler.random.seed("SPENCER");
      scheduler.generateJobs();
      scheduler.play(0, scheduler => {
         console.log("tick");
         updateScheduler(immutInstance(scheduler));
      });
      return immutInstance(scheduler);
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