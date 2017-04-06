/**
 * Lessons
 */

import dispatcher from "./dispatcher";

const requireLesson = require.context("./lessons");

const lessons = {
   ["EXPLORE"]: getLesson("./explore"),
   ["DUMB"]: getLesson("./dumb"),
   ["GETTING STARTED"]: getLesson("./dumb"),
   ["JOB LIFE CYCLE"]: getLesson("./dumb"),
   ["BASIC IO"]: getLesson("./dumb"),
   ["THE TIME QUANTUM"]: getLesson("./dumb"),
   ["IO FREQUENCY AND PRIORITY"]: getLesson("./dumb"),
   ["PERSISTENT TIME QUANTUMS"]: getLesson("./dumb"),
   ["THE BOOST TIMER"]: getLesson("./dumb")
};

function getLesson(path) {
   const obj = requireLesson(path).default;
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