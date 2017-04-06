/**
 * Lessons
 */

import dispatcher from "./dispatcher";

const requireLesson = require.context("./lessons");

const lessons = {
   ["EXPLORE"]: getLesson("./explore"),
   ["GETTING STARTED"]: getLesson("./getstarted"),
   ["JOB LIFE CYCLE"]: getLesson("./joblife"),
   ["BASIC IO"]: getLesson("./basicIO"),
   ["THE TIME QUANTUM"]: getLesson("./tq"),
   ["IO FREQUENCY AND PRIORITY"]: getLesson("./iofreq"),
   ["PERSISTENT TIME QUANTUMS"]: getLesson("./persistentTQs"),
   ["THE BOOST TIMER"]: getLesson("./boostTimer")
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