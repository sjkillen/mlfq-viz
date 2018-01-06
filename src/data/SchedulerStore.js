/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { updateScheduler, actions, playback, unstepping } from "./SchedulerActions";
import dispatcher from "./dispatcher";
import { immutInstance } from "../util";
import { fromJS as immut } from "immutable";
import Scheduler from "../mlfq";
import { actions as lessonActions } from "./lessons";

class SchedulerStore extends ReduceStore {
   getInitialState() {
      scheduler.generateJobs();
      const prev = setStates(scheduler, {});
      return immut({
         scheduler: freezeSched(scheduler),
         prevJobStates: prev,
         lessonOptions: {},
         selectedJobId: -1,
         fillAttr: "none",
         displayAttr: [],
         playBackMode: playback.paused,
         lastUpdate: performance.now(),
      }).setIn(["scheduler", "changed"], true);
   }
   getScheduler() {
      const state = this.getState();
      const sched = state.get("scheduler").toJS();
      sched.selectedJobId = state.get("selectedJobId");
      sched.fillAttr = state.get("fillAttr");
      sched.playMode = state.get("playBackMode");
      sched.displayAttr = state.get("displayAttr").toJS();
      sched.lessonOptions = state.get("lessonOptions").toJS();
      return sched;
   }
   reduce(state, action) {
      switch (action.type) {
         case actions.UPDATE_SCHEDULER: {
            const sched = action.data;
            const prev = setStates(sched, state.get("prevJobStates").toJS());
            return state
               .set("scheduler", freezeSched(sched))
               .set("prevJobStates", prev)
               .setIn(["scheduler", "changed"], true);
         }
         case actions.SELECT_JOB: {
            return state.set("selectedJobId", action.data.init.id)
               .setIn(["scheduler", "changed"], false);
         }
         case actions.SET_JOB_FILL: {
            return state.set("fillAttr", action.data)
               .setIn(["scheduler", "changed"], false);
         }
         case lessonActions.SET_LESSON: {
            return configLesson(state, action.data);
         }
         case actions.SET_PLAYBACK: {
            let changed = false;
            if (action.data === playback.paused) {
               scheduler.stop();
            } else if (action.data === playback.playing && notPlaying(state)) {
               scheduler.play(schedulerLoop);
            } else if (action.data === playback.stepping) {
               scheduler.stop();
               setTimeout(() => {
                  unstepping(scheduler.speed);
                  if (notPlaying(state)) {
                     scheduler.playNext(schedulerLoop);
                  }
               }, 0);
            } else if (action.data === playback.restarting) {
               changed = true;
               restart(state, action.config);
            }
            return state.set("playBackMode", action.data)
               .setIn(["scheduler", "changed"], changed);
         }
         case actions.UNSTEP: {
            return state.set("playBackMode", playback.paused)
               .setIn(["scheduler", "changed"], false);
         }
         default:
            return state;
      }
   }
}

function notPlaying(state) {
   const mode = state.get("playBackMode");
   return mode !== playback.playing &&
      mode !== playback.stepping;
}

function restart(state, config) {
   if (!notPlaying(state)) { scheduler.stop(); }
   Scheduler.call(scheduler, config || scheduler.config);
   setTimeout(() => {
      updateScheduler(scheduler);
      scheduler.generateJobs();
      unstepping(300);
   }, 0);
}

function configLesson(state, lesson) {
   restart(state, immut(lesson.simulation).toJS());
   if (lesson.scheduler.attributes.indexOf(state.get("fillAttr")) === -1) {
      state = state.set("fillAttr", lesson.scheduler.attributes[0]);
   }
   return state.set("displayAttr", immut(lesson.scheduler.attributes))
      .set("lessonOptions", immut(lesson.scheduler.options));
}

function schedulerLoop(sched) {
   updateScheduler(sched);
}

function freezeSched(s) {
   const { allJobs, simulationFinished } = s;
   return immutInstance(s).toMap().merge({ allJobs, simulationFinished });
}

function setStates(sched, prevStates) {
   const prevJobStates = {};
   function set(jobs, state) {
      jobs.forEach(job => {
         job.state = state;
         job.prevState = prevStates[job.init.id] || "future";
         prevJobStates[job.init.id] = state;
      });
   }
   set(sched.ioJobs, "io");
   set(sched.futureJobs, "future");
   set(sched.finishedJobs, "finished");
   sched.queues.forEach(queue => {
      set(queue.jobs, "waiting");
   });
   if (sched.cpuJob) {
      set([sched.cpuJob], "cpu");
   }
   return immut(prevJobStates);
}

export default new SchedulerStore(dispatcher);
