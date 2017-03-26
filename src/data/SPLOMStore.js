/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { actions as schedActions} from "./SchedulerActions";
import { actions } from "./SPLOMActions";
import dispatcher from "./dispatcher";
import { accessorMatrix } from "./dataAccessors";

class SPLOMStore extends ReduceStore {
   getInitialState() {
      return {
          accessors: accessorMatrix([
              ".init.runTime",
              ".init.createTime",
              ".init.ioFreq",
          ])
      };
   }
   reduce(state, action) {
      switch (action.type) {
         case actions.UPDATE_MATRIX: {
            return {
                accessors: accessorMatrix(action.data)
            };
         }
         default:
            return state;
      }
   }
}

export default new SPLOMStore(dispatcher);