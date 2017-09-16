/**
 * Lessons
 */

import dispatcher from "./dispatcher";

const requireLesson = require.context("./lessons");

export const actions = {
    SET_LESSON: Symbol("SET_LESSON")
};

export const lessons = [
    freezeLesson("./getstarted"),
    freezeLesson("./joblife"),
    freezeLesson("./basicIO"),
    freezeLesson("./tq"),
    freezeLesson("./iofreq"),
    freezeLesson("./persistentTQs"),
    freezeLesson("./boostTimer"),
    freezeLesson("./explore")
];

/**
 * Set the initial lesson
 */
setLesson(0);

function freezeLesson(path) {
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

export function setLesson(i) {
    dispatcher.dispatch({
        type: actions.SET_LESSON,
        data: lessons[i]
    })
}

function validIndex(i) {
    if (!Number.isInteger(i)) return false;
    if (i < 0) return false;
    if (i > lessons.length) return false;
    return true;
}

export function nextLesson(currLesson) {
    const next = currLesson + 1;
    if (validIndex(next)) {
        setLesson(next);
    }
}

export function prevLesson(currLesson) {
    const prev = currLesson - 1;
    if (validIndex(prev)) {
        setLesson(prev);
    }
}