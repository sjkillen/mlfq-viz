/**
 * Manages the state of the detail view
 */

import { ReduceStore } from "flux/utils";
import dispatcher from "./dispatcher";
import { fromJS as immut } from "immutable";
import { actions as lessonActions } from "./lessons";

class DetailStore extends ReduceStore {
   getInitialState() {
      return immut({
         details: {
            attributes: [],
            lesson: [],
         },
      });
   }
   reduce(state, action) {
      switch (action.type) {
         case lessonActions.SET_LESSON:
            const { details } = action.data;
            return state.set("details", immut(details));
         default:
            return state;
      }
   }
}

export default new DetailStore(dispatcher);
