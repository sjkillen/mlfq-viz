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
import { externalJob } from"./SchedulerPanel";

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
         <table className="attributes">
            {details.attributes
               .map(attr => [attr, props[attr]])
               .map(([id, attr]) => {
                  return (
                     <tr key={id} className="attr">
                        <td className="key">
                           {attr.label}
                        </td>
                        <td className="value">
                           {select ? attr.access(select) : "-"}
                        </td>
                     </tr>
                  )
               })}
         </table>
      </div>
   );
}

function calcLesson(scheduler, details) {
   for (let i = details.lesson.length - 1; i >= 0; i--) {
      const { message, atCycle } = details.lesson[i];
      if (scheduler.globalTick >= atCycle) {
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