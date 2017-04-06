/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import PAStore from "../data/PAStore";
import "./PAPanel.scss";
export default Container.createFunctional(PAPanel, () => [SchedulerStore, PAStore], () => {
   return {
         scheduler: SchedulerStore.getScheduler(),
         PAAttr: PAStore.getState().accessors
   }
});


let unique = 0;
/**
 * Called every state change
 */
function PAPanel(scheduler) {
   return (
      <span className="PAPanel">
         <svg ref={(el) => update(el, scheduler)} className="image3">
         </svg>
      </span>
   );
}
function update(svgElement, { scheduler, PAAttr }) {
   if (!svgElement) return;

   //CREATE NEW SCALE - CHANGE sizeOfMatrix in SPLOMPanel to adjust SPLOM size
   const newScale = initPAScale(1000, 1000, PAAttr.length);
   const svg = d3.select(svgElement)
               .attr("height", newScale.height)
                .attr("width", newScale.width)
   //Main svg
   debugger;
   const AxisJoin = svg.selectAll("g.Axis")
                        .data(PAAttr,d => unique++);
   const enter = AxisJoin.enter()
   const exit  = AxisJoin.exit().remove()

   //Draw axis
   const axis = enter.append("g")
                     .classed("axis",true)
                     .each(function(d,i){
                           const shiftX = i* (newScale.size )+ newScale.padding;
                           const addParallelAxis = d3.select(this)
                                                      .attr("style",`transform: translate(+${shiftX}px, +${0}px)`)
                                                      .call(parallelAxis,scheduler,d,newScale,shiftX)
                     })
  
}
/**
 * Generate a parallelAxis
 * @param svg element
 * @param scheduler
 * @param accessor - to access the data
 * @param scale - scale for the axis
 */
function parallelAxis(svg, scheduler, accessor, scale, shiftX) {
      //MAKING Y AXIS        
      const [minY,maxY] = accessor.getDomainY(scheduler);
      var yAxis = d3.axisLeft(scale.yScale.domain([minY,maxY]));

      const jobJoin = svg.selectAll("g.axis")
            .data([0])

      const jobEnter = jobJoin.enter()

      //Add Y axis
      jobEnter.append("g")
              .classed("axis y",true)
              .call(yAxis);
      //Add label for Y axis
      jobEnter.append("text")  
                  .style("text-anchor", "middle")
                   .style("font-size", `${scale.size/15}px`)
                  .attr("transform", `translate(${0},${scale.height-scale.padding}) `)
                  .text(accessor.labelY);
      return yAxis;
}
/**
 * draw lines on parallelAxis
 * @param svg
 * @param scheduler 
 * @param accessor
 * @param scale  
 */
function drawLines(svg, scheduler, accessor, scale) {
      const update = svg.selectAll("path.job")
                        .classed("job", true)
                        .data(scheduler.allJobs, d => d.init.id)

      const enter = update.enter()

      var data = [{x:1,y:1},{x:1,y:3},{x:4,y:3},{x:5,y:2},{x:6,y:2},{x:7,y:1}];
      //Prepare line
      var line = d3.line()
                   .x(function(d,i) {return d.x*6;})
                   .y(function(d,i) {return d.y*4;})

      //Creating dots
      enter.append("path")
            .classed("job", true)
             .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line(data))
}  
/**
 * Generate all the needed scales
 */
function initPAScale(width, height, numberOfAxis) {
   const padding = ((height / (numberOfAxis-1) * 0.2));
   const size = (width - padding*2)/(numberOfAxis-1);

   const yScale = d3.scaleLinear()
      .range([height*.9 - padding/2, padding/2]);
   return {
      width,
      height,
      padding,
      size,
      numberOfAxis,
      //SCALE FOR DATA INPUT
      yScale: yScale
   }
}
