/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { actions as schedActions } from "./SchedulerActions";
import dispatcher from "./dispatcher";
import { accessorMatrix } from "./dataAccessors";
import { actions as lessonActions } from "./lessons";

class SPLOMStore extends ReduceStore {
   getInitialState() {
      return {
         accessors: accessorMatrix([])
      };
   }
   reduce(state, action) {
      switch (action.type) {
         case lessonActions.SET_LESSON: {
            return {
               accessors: accessorMatrix(action.data.splom.attributes)
            };
         }
         default:
            return state;
      }
   }
}

export default new SPLOMStore(dispatcher);