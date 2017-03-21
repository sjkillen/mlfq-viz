/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import "./SchedulerPanel.scss";

export default Container.createFunctional(SPLOMPanel, () => [SchedulerStore], () => {
   return SchedulerStore.getScheduler();
});

/**
 * Called every state change
 */
function SPLOMPanel(scheduler) {       
   return (
      <span className="SPLOMPanel">
         <svg ref={(el) => update(el,scheduler)} className="image2">
         </svg>
      </span>
   );
}



function update(svgElement,scheduler) {
   if (!svgElement) return;
   //SIZES
   var newScale = initSPLOMScale(1000,1000,4); 
    
   const SPLOMAttr = {
        getX(d) {
            return d.init.runTime
        },
        getY(d) {
        return d.init.createTime
        }
    };

   //MAIN svg
   var svg = d3.select(svgElement)
                    .attr("height", newScale.height)
                    .attr("width",newScale.width)
                    .attr("style", `transform: translate(+${newScale.width / 2}px, 10px)`);
    
    svg.call(scatterPlot,scheduler,SPLOMAttr,newScale)
   // for (var i = 0; i < NumberOfGraph; i++)
       // {for(var j = 0; j<NumberOfGraph;j++){
        //PREPARE SCALE

        //CALCULATE SHIFTED VALUES
       // var shiftX = i*size;
       // var shiftY = j*size;
        /*
        //CREATE NEW CHART
        var chartGroup = svg.append("g")
                            .classed("group"+1, true)
                            .attr("transform","translate("+(padding+shiftX)+","+(padding+shiftY)+")");
                            */
}


/**
 * Generate a scatterPlot
 * @param svg element
 * @param scheduler
 * @param accessor - to access the data
 * @param scale - scale for the axis
 */
function scatterPlot(svg,scheduler,accessor,scale) {
     //MAKING Y AXIS        
    var yAxis = d3.axisLeft(scale.xScale.domain([0,d3.max(accessor.getX(scheduler))]));
    //MAKING X AXIS  
    var xAxis = d3.axisBottom(scale.yScale.domain([10,0]));

    const jobJoin = svg.selectAll("g.axis")
                       .data([0])

    const jobEnter = jobJoin.enter()
    //Making x Axis
    jobEnter.append("g")
            .classed("axis x",true)
            .attr("transform", `translate(${scale.padding/2},${(scale.size+(scale.padding/2))})`)
            .call(xAxis)

     // Making y Axis      
     jobEnter.append("g")
            .classed("axis y",true)
            .attr("transform",`translate(${scale.padding},${scale.padding})`)
            .call(yAxis)

    scatterPlotDots(svg,scheduler,accessor,scale)
}
/**
 * Plotting dots on graph
 * @param svg
 * @param scheduler 
 */
function scatterPlotDots(svg,scheduler,accessor,scale){
    const update = svg.selectAll("circle.job")
                      .classed("job",true)
                      .data(scheduler.finishedJobs)
                     
    const enter = update.enter()

    enter.append("circle")  
         .classed("job",true)
         .attr("r", 4)
         .attr("cx", d => scale.xScale(accessor.getY(d)))
         .attr("cy", d => scale.yScale(accessor.getY(d)))
         .attr("transform",`translate(${scale.padding},${scale.padding})`)
}   

/**
 * Generate all the needed scales
 */
function initSPLOMScale(width,height,numberOfGraph) {
    const padding = ((height/numberOfGraph)*0.15);
    const size = ((height/numberOfGraph)*0.85);
   
    const xScale = d3.scaleLinear()
                    .range([padding / 2, size - padding / 2]);
                   // .domain([0,4]);
    const yScale = d3.scaleLinear()
                    .range([size - padding / 2, padding / 2]);
                    //.domain([0,4]);
    return {
        width,
        height,
        padding,
        size,
        numberOfGraph,
        //SCALE FOR DATA INPUT
        xScale: xScale,
        yScale: yScale
    }
}