/**
 * Render the Scheduler Panel
 */


import React, { Component } from "react";
import * as d3 from "d3";


/**
 * Called every state change
 */
export default function SchedulerPanel(scheduler) {
   return (
      <span className="SchedulerPanel">
         <svg ref={(el) => update(el, scheduler)} className="image">
         </svg>
      </span>
   );
}


function update(svgElement, scheduler) {
   if (!svgElement) return;
   const width = 1800, height = 500;

   const futureScale = d3.scaleLinear().domain([
      0,
      scheduler.config.jobCreateTimeRange[1]
   ]).range([0, width]);


   const serviceScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, height]);

   const sizeScale = d3.scaleLinear()
      .domain([0, scheduler.numQueues])
      .range([30, 4]);

   const axis = d3.axisBottom(futureScale);

   const jobHeight = d => serviceScale(d.running.serviceTime / d.init.runTime);

   const svg = d3.select(svgElement)
      .attr("height", height)
      .attr("width", width);
   svg.append("g")
      .attr("transform", `translate(0, ${height - 20})`)
      .call(axis);
   const join = svg
      .selectAll("circle")
      .data([].concat(scheduler.futureJobs, ...scheduler.ioJobs, ...scheduler.queues.map(q => q.jobs)), d => d.init.id)
      .attr("cx", d => futureScale(d.init.createTime))
      .attr("r", d => sizeScale(d.running.priority) + "px")
      .attr("fill", d => d.running.ioLeft > 0 ? "yellow" : "red")
      .attr("style", "transition:cy 0.1s linear")
      .attr("cy", jobHeight);
   join.enter()
      .append("circle")
      .attr("r", d => sizeScale(d.running.priority) + "px")
      .attr("cx", d => futureScale(d.init.createTime))
      .attr("cy", jobHeight)
      .attr("fill", d => d.running.ioLeft > 0 ? "yellow" : "red")
      .attr("style", "transition:cy 0.1s linear");
   join.exit()
      .attr("fill", "black")
      .attr("cy", height - 50);
      debugger;
  /* svg.select("line").remove();

   svg.append("line")
      .attr("x1", futureScale(scheduler.globalTick))
      .attr("x2", futureScale(scheduler.globalTick))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("style", "stroke:rgb(200,220,255);stroke-width:8");*/
}
