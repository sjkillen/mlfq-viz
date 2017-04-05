/**
 * Lessons
 */

import dispatcher from "./dispatcher";

const lessons = {
   ["EXPLORE"]: require("./lessons/explore").default,
   ["DUMB"]: require("./lessons/dumb").default,
   ["GETTING STARTED"]: require("./lessons/dumb").default,
   ["JOB LIFE CYCLE"]: require("./lessons/dumb").default,
   ["BASIC IO"]: require("./lessons/dumb").default,
   ["THE TIME QUANTUM"]: require("./lessons/dumb").default,
   ["IO FREQUENCY AND PRIORITY"]: require("./lessons/dumb").default,
   ["PERSISTENT TIME QUANTUMS"]: require("./lessons/dumb").default,
   ["THE BOOST TIMER"]: require("./lessons/dumb").default
};

export default lessons;

export const actions = {
   SET_LESSON: Symbol("SET_LESSON")
};

export function setLesson(key) {
   dispatcher.dispatch({
      type: actions.SET_LESSON,
      data: lessons[key]
   })
}