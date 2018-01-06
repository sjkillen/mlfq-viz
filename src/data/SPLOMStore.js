/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { actions as schedActions } from "./SchedulerActions";
import dispatcher from "./dispatcher";
import { accessorPairs } from "./dataAccessors";
import { actions as lessonActions } from "./lessons";

class SPLOMStore extends ReduceStore {
   getInitialState() {
      return {
         accessors: [],
         selected: 0,
      };
   }
   reduce(state, action) {
      switch (action.type) {
         case lessonActions.SET_LESSON: {
            return {
               accessors: accessorPairs(action.data.splom.attributes),
               selected: 0,
            };
         }
         case "SELECT_SCATTERPLOT": {
            return {
               accessors: state.accessors,
               selected: action.index,
            };
         }
         default:
            return state;
      }
   }
}

export default new SPLOMStore(dispatcher);
