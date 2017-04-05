/**
 * Manages the state of the scheduler
 */

import { ReduceStore } from "flux/utils";
import scheduler from "../scheduler";
import { updateScheduler, actions, playback, unstepping } from "./SchedulerActions";
import dispatcher from "./dispatcher";
import { immutInstance } from "../util";
import { fromJS as immut } from "immutable";
import Scheduler from "../mlfq"

class SchedulerStore extends ReduceStore {
   getInitialState() {
      scheduler.generateJobs();
      const prev = setStates(scheduler, {})
      return immut({
         scheduler: freezeSched(scheduler),
         prevJobStates: prev,
         selectedJobId: -1,
         fillAttr: "none",
         playBackMode: playback.paused,
         lastUpdate: performance.now()
      }).setIn(["scheduler", "changed"], true);
   }
   getScheduler() {
      const state = this.getState();
      const scheduler = state.get("scheduler").toJS();
      scheduler.selectedJobId = state.get("selectedJobId");
      scheduler.fillAttr = state.get("fillAttr");
      scheduler.playMode = state.get("playBackMode");
      return scheduler;
   }
   reduce(state, action) {
      switch (action.type) {
         case actions.UPDATE_SCHEDULER: {
            const scheduler = action.data;
            const prev = setStates(scheduler, state.get("prevJobStates").toJS());
            return state
               .set("scheduler", freezeSched(scheduler))
               .set("prevJobStates", prev)
               .setIn(["scheduler", "changed"], true)
         }
         case actions.SELECT_JOB: {
            return state.set("selectedJobId", action.data.init.id)
               .setIn(["scheduler", "changed"], false);
         }
         case actions.SET_JOB_FILL: {
            return state.set("fillAttr", action.data)
               .setIn(["scheduler", "changed"], false);
         }
         case actions.SET_PLAYBACK: {
            let changed = false;
            if (action.data === playback.paused) {
               scheduler.stop();
            } else if (action.data === playback.playing && this.notPlaying(state)) {
               scheduler.play(schedulerLoop);
            } else if (action.data === playback.stepping) {
               scheduler.stop();
               setTimeout(() => {
                  unstepping(scheduler.speed);
                  if (this.notPlaying(state)) {
                     scheduler.playNext(schedulerLoop)
                  }
               }, 0);
            } else if (action.data === playback.restarting) {
               if (!this.notPlaying(state)) scheduler.stop();
               Scheduler.call(scheduler, scheduler.config);
               changed = true;
               setTimeout(() => {
                  updateScheduler(scheduler);
                  scheduler.generateJobs();
                  unstepping(300);
               }, 0);
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
   notPlaying(state) {
      const mode = state.get("playBackMode");
      return mode !== playback.playing &&
         mode !== playback.stepping;
   }
}

function schedulerLoop(scheduler) {
   updateScheduler(scheduler);
}

function freezeSched(s) {
   const { allJobs, simulationFinished } = s;
   return immutInstance(s).toMap().merge({ allJobs, simulationFinished });
}

function setStates(scheduler, prevStates) {
   const prevJobStates = {};
   function set(jobs, state) {
      jobs.forEach(job => {
         job.state = state;
         job.prevState = prevStates[job.init.id] || "future";
         prevJobStates[job.init.id] = state;
      });
   }
   set(scheduler.ioJobs, "io");
   set(scheduler.futureJobs, "future");
   set(scheduler.finishedJobs, "finished");
   scheduler.queues.forEach(queue => {
      set(queue.jobs, "waiting");
   });
   if (scheduler.cpuJob) {
      set([scheduler.cpuJob], "cpu");
   }
   return immut(prevJobStates);
}

export default new SchedulerStore(dispatcher);