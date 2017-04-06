/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import dispatcher from "./dispatcher";
import { fromJS as immut } from "immutable";
import { actions as lessonActions } from "./lessons"

class HeaderStore extends ReduceStore {
   getInitialState() {
      return immut({
         selectedLesson: ""
      })
   }
   reduce(state, action) {
      switch (action.type) {
         case lessonActions.SET_LESSON:
            return state.set("selectedLesson", action.data.lessonName);
         default:
            return state;
      }
   }
}

export default new HeaderStore(dispatcher);