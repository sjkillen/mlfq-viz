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
   var dataArray = [2,5,8,9,5,3,6,7,4,6,7,8,3,2,4,6,4,5]
   //var margin = {top:30,right:30,bottom:30,left:30};
   const width = 1000, size = 200;
   console.log(scheduler.allJobs[1].running.AvgPriority);
   //console.log(d3.select("svgElement").text)

   var p = d3.select("svgElement").selectAll("p")
            .data([].scheduler.allJobs)
            .enter()
            .append("p")
            .text(function (d,i){
                return d;
            })
   /*var area = d3.area()
                .x(function(d,i){return i*20;})
                .y(100)
                .y1(function(d){return 100-d; })

    var svg = d3.select(svgElement)
                .append("svg")
                .attr("height","100%")
                .attr("width","100%");
    
    
  // console.log(scheduler.allJobs);

   

     var yScale = d3.scaleLinear()
                    .domain([0,d3.max(dataArray)])
                    .range([100,0])
                    .nice();

    var xScale = d3.scaleLinear()
                    .domain([0,d3.max(dataArray)])
                    .range([0,width])
                    .nice();


    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    var chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

    chartGroup.append("path").attr("d",area(dataArray));

    chartGroup.append()

    svg.append("g")
        .attr("class","axis y")
        .attr("transform","translate("+margin.left+","+margin.top+")")
        .call(yAxis);
    
 

    
   // svg.call(yAxis);

    */


   
}

