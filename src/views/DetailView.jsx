/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import dispatcher from "../data/dispatcher";
import { fromJS as immut } from "immutable";
import { actions as lessonActions } from "../data/lessons";
import DetailStore from "../data/DetailStore";
import { props } from "../data/dataAccessors";
import "./PlaybackControl.scss";
import { setJobFillAttribute, playback, setPlayback } from "../data/SchedulerActions";
import "./DetailView.scss";
import { externalJob } from "./SchedulerPanel";
import { pauseScheduler } from "../data/SchedulerActions";
import { getLabel } from "../data/dataAccessors";

export default Container.createFunctional(DetailView, () => [SchedulerStore, DetailStore], () => {
  const scheduler = SchedulerStore.getScheduler();
  return {
    select: findSelected(scheduler.allJobs, scheduler.selectedJobId),
    details: DetailStore.getState().get("details").toJS(),
    scheduler
  };
});

/**
 * Called every state change
 */
function DetailView({ select, scheduler, details }) {
  const lesson = calcLesson(scheduler, details);
  return (
    <div className="DetailView">


      <svg ref={el => update(el, scheduler, select)} className="preview">

      </svg>
      <div className="content">
        <div className="lesson">
          <div className="message">
            {lesson.message}
          </div>
          <div className="next">
            {lesson.next}
          </div>
        </div>
      </div>
      <div className="attrContainer">
        {details.attributes.map(attr => [attr, props[attr]])
          .map(([id, attr]) => {
            const selected = isSelected(scheduler, id)
            return (
              <div key={id} className={"attr" + selected}>
                <span className="key">
                  <ToolTip text={attr.tooltip}>{attr.label}</ToolTip>
                </span>
                <span className="value">
                  {select ? cleanDetail(attr.access(select)) : "-"}
                </span>
              </div>
            )
          })}
      </div>


      <div className="controls">
        <select className="select" value={scheduler.fillAttr} onChange={e => setJobFillAttribute(e.target.value)}>
          {scheduler.displayAttr.map((attr, i) => {
            return (<option key={i} value={attr}>{getLabel(attr)}</option>)
          })}
        </select>
        <div>
          <PlaybackControl disableStates={[playback.stepping, playback.restarting]} currMode={scheduler.playMode} mode={playback.playing}>Play</PlaybackControl>
          <PlaybackControl disableStates={[playback.stepping, playback.restarting]} currMode={scheduler.playMode} mode={playback.paused}>Pause</PlaybackControl>
          <PlaybackControl disableStates={[playback.stepping, playback.restarting]} currMode={scheduler.playMode} mode={playback.stepping}>Step</PlaybackControl>
          <PlaybackControl disableStates={[playback.stepping]} currMode={scheduler.playMode} mode={playback.restarting}>Restart</PlaybackControl>
        </div>
      </div>

    </div>

  );
}

function PlaybackControl({ mode, children, currMode, disableStates }) {
  let addClass = currMode === mode ? " active" : " inactive";
  let disabled = false;
  if (disableStates.indexOf(currMode) !== -1) {
    addClass += " disabled";
    disabled = true;
  }
  return (
    <span className="PlaybackControl">
      <button className={addClass} onClick={e => {
        if (disabled) return;
        setPlayback(mode)
      }}>
        {children}
      </button>
    </span>
  );
}


function isSelected(scheduler, id) {
  const yes = " selected";
  const tq = /t[^.]*q/i;
  const pri = /priority/i;
  if (scheduler.fillAttr === id) return yes;
  if (scheduler.fillAttr.match(tq) && id.match(tq)) return yes;
  if (scheduler.fillAttr.match(pri) && id.match(pri)) return yes;
  return "";
}

/**
 * Rounds and cleans attribute to display in details panel
 * Infinity gets displayed as Inf
 * < 0 gets displayed as -
 * @param {*} num 
 */
function cleanDetail(num) {
  if (!Number(num)) return num;
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return "Inf";
  } else if (num < 0) {
    return "-";
  }
  else {
    return ((num * 1000) | 0) / 1000;
  }
}


function ToolTip({ children, text }) {
  return (
    <span onClick={e => alert(text)} className="tooltip">
      {children}
    </span>
  )
}

function calcLesson(scheduler, details) {
  for (let i = details.lesson.length - 1; i >= 0; i--) {
    const { message, atCycle, dontPause } = details.lesson[i];
    if (scheduler.globalTick === atCycle && scheduler.globalTick > 1 && !dontPause) {
      pauseScheduler(scheduler);
    }
    if (scheduler.globalTick >= (atCycle - 1)) {
      let next = "Lesson Complete";
      const nextLesson = details.lesson[i + 1];
      if (nextLesson) {
        next = `Next message at cycle ${nextLesson.atCycle}`;
      }
      return {
        message,
        next
      };
    }
  }
  return {
    message: "Select a lesson from the menu above",
    next: ""
  }
}

function findSelected(jobs, id) {
  for (const job of jobs) {
    if (job.init.id === id) {
      return job;
    }
  }
}

function update(svg, scheduler, select) {
  externalJob(svg, scheduler, select)
}