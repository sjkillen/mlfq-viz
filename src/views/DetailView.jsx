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
import "./DetailView.scss";
import { externalJob } from "./SchedulerPanel";
import { pauseScheduler } from "../data/SchedulerActions";

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
         {divideAttrColumns(details.attributes).map((attrCol, i) => {
            return (<table key={i} className="attributes">
               <tbody>
                  {attrCol
                     .map(attr => [attr, props[attr]])
                     .map(([id, attr]) => {
                        return (
                           <tr key={id} className="attr">
                              <td className="key">
                                 <ToolTip text={attr.tooltip}>{attr.label}</ToolTip>
                              </td>
                              <td className="value">
                                 {select ? round(attr.access(select)) : "-"}
                              </td>
                           </tr>
                        )
                     })}
               </tbody>
            </table>);
         })}
      </div>
   );
}


function round(num) {
   return ((num * 1000) | 0) / 1000;
}

/**
 * Divide array into groups of three or less
 */
function divideAttrColumns(arr) {
   const cols = [];
   let curr;
   for (let i = 0, size = 3; i < arr.length; i++) {
      if (size === 3) {
         size = 0;
         curr = [];
         cols.push(curr)
      }
      curr.push(arr[i]);
      size++;
   }
   return cols;
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
      const { message, atCycle } = details.lesson[i];
      if (scheduler.globalTick === atCycle && scheduler.globalTick > 1) {
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
      message: "Lesson text appears here",
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