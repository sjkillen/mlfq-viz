/**
 * Render a table for analyzing data
 */


import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import Scheduler from "../mlfq";

import "./TableView.scss";

export default Container.createFunctional(TableView, () => [SchedulerStore], () => {
   return SchedulerStore.getScheduler();
});


/**
 * Called every state change
 */
function TableView(scheduler) {
   let summaryTable = <span />;
   if (scheduler.simulationFinished) {
      summaryTable = (
         <span>
            <table>
               <tbody>
                  <tr>
                     <th>Job Id</th>
                     <th>Response Time</th>
                     <th>Turnaround Time</th>
                     <th>Avg Priority</th>
                  </tr>
                  {scheduler.allJobs.map(job => {
                     return (
                        <tr key={job.init.id}>
                           <td>{job.init.id}</td>
                           <td>{job.perf.responseTime}</td>
                           <td>{job.perf.turnaroundTime}</td>
                           <td>{job.running.AvgPriority}</td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
            <table>
               <tbody>
                  <tr>
                     <th>Scheduler Fairness</th>
                     <th>CPU Utilization</th>
                     <th>Throughput</th>
                  </tr>
                  <tr>
                     <td>???</td>
                     <td>???</td>
                     <td>???</td>
                  </tr>
               </tbody>
            </table>
         </span>
      );
   }

   return (
      <span className="TableView">
         <table style={{
            position: "fixed",
            left: "900px",
            top: "100px"
         }}>
            <tbody>
               <tr>
                  <th>Priority Level</th>
                  <th>Time Quantum</th>
               </tr>
               {scheduler.queues.map((queue, i) => {
                  return (
                     <tr key={i}>
                        <td>Queue {i}</td>
                        <td>{queue.timeQuantum}</td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
         <table style={{
            position: "fixed",
            left: "900px",
            bottom: "100px"
         }}>
            <tbody>
               <tr>
                  <th>Job Id</th>
                  <th>Create Time</th>
                  <th>Run time</th>
                  <th>IO Frequency</th>
               </tr>
               {scheduler.allJobs.map(job => {
                  return (
                     <tr key={job.init.id}>
                        <td>{job.init.id}</td>
                        <td>{job.init.createTime}</td>
                        <td>{job.init.runTime}</td>
                        <td>{job.init.ioFreq}</td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
         <div ref={(el) => update(el, scheduler)} />
         {summaryTable}
      </span>
   );
}

function update(tableContainer, scheduler) {
   if (!tableContainer) return;
   const width = 1800, height = 500;

   const container = d3.select(tableContainer);

   /**
    * Runtime job Table
    */
   {
      container.append("h3").text(`${scheduler.globalTick} CPU cycle${scheduler.globalTick === 1 ? " has" : "s have"} past`);
      container.append("h4")
         .attr("style", scheduler.boostLeft === scheduler.boostTime ? "color: orange" : "")
         .text(`Boost timer is ${scheduler.boostLeft} / ${scheduler.boostTime}`);
      const table = container.append("table"),
         headers = table.append("tr");

      const join = table.selectAll("tr")
         .data([{}, ...scheduler.allJobs]);

      const rows = join.enter()
         .append("tr");


      rows.attr("style", d => {
         if (d.running.serviceTime === d.init.runTime) {
            return "background: tomato";
         }
         if (scheduler.cpuJob && scheduler.cpuJob.init.id === d.init.id) {
            return "background: lightgreen";
         }
         return d.init.createTime >= scheduler.globalTick ? "background: lightblue" : "";
      });

      headers.append("th").text("Job Id");
      rows.append("td").text(d => d.init.id);

      headers.append("th").text("Current Priority");
      rows.append("td")
      .attr("style", "font-weight: bold")
      .text(d => `Queue ${d.running.priority}`);

      headers.append("th").text("Time Quantum Remaining");
      rows.append("td")
      .attr("style", "font-weight: bold")
      .text(d => `${d.running.quantumLeft}`);

      headers.append("th").text("Time Quantum");
      rows.append("td")
      .attr("style", "font-weight: bold")
      .text(d => `${d.running.quantumFull}`);


      headers.append("th").text("Service Time");
      rows.append("td").text(d => d.running.serviceTime);

      headers.append("th").text("Waiting Time");
      rows.append("td").text(d => d.running.waitingTime);


      headers.append("th").text("Doing IO");
      rows.append("td").text(d => d.running.ioLeft ? "YES" : "NO");

      headers.append("th").text("Created");
      rows.append("td").text(d => d.init.createTime >= scheduler.globalTick ? "NO" : "YES");

      headers.append("th").text("Finished");
      rows.append("td").text(d => d.running.serviceTime === d.init.runTime  ? "YES" : "NO");
   }


   if (scheduler.simulationFinished) {
      container.append("h1").text(`Simulation finished after ${scheduler.globalTick} cycles`);
   }

}
;