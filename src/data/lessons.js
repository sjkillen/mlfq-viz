/**
 * Lessons
 */

import dispatcher from "./dispatcher";

const lessons = {
   ["EXPLORE"]: getLesson("./lessons/explore"),
   ["DUMB"]: getLesson("./lessons/dumb"),
   ["GETTING STARTED"]: getLesson("./lessons/dumb"),
   ["JOB LIFE CYCLE"]: getLesson("./lessons/dumb"),
   ["BASIC IO"]: getLesson("./lessons/dumb"),
   ["THE TIME QUANTUM"]: getLesson("./lessons/dumb"),
   ["IO FREQUENCY AND PRIORITY"]: getLesson("./lessons/dumb"),
   ["PERSISTENT TIME QUANTUMS"]: getLesson("./lessons/dumb"),
   ["THE BOOST TIMER"]: getLesson("./lessons/dumb")
};

function getLesson(path) {
   const obj = require(path).default;
   deepFreeze(obj);
   return obj;
}

/**
 * Deeply freeze an obj
 */
function deepFreeze(obj) {
   for (const key of Object.getOwnPropertyNames(obj)) {
      if (typeof obj[key] === "object") {
         deepFreeze(obj[key]);
      }
   }
   Object.freeze(obj);
}

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