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
   const NumberOfGraph = 1;
   const width = 1000, height = 1000;
   const padding = ((height/NumberOfGraph)*0.15),size = ((height/NumberOfGraph)*0.85);   
    
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
                    .attr("height", height)
                    .attr("width",width)
                    .attr("style", `transform: translate(+${width / 2}px, 10px)`);
    
    svg.call(scatterPlot,scheduler,SPLOMAttr)
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
        //DRAW X AXIS
        chartGroup.append("g")
            .attr("class","axis x")
            .attr("transform","translate("+((padding/2))+","+((size+padding/2))+")")
            .call(xAxis)

        //DRAW Y AXIS
        chartGroup.append("g")
            .attr("class","axis y")
            .attr("transform","translate("+(padding)+","+(padding)+")")
            .call(yAxis)

        //PLOT GRAPH
        /*chartGroup.append("g").selectAll("circle")
            .data(scheduler.allJobs)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", d => x(d.running.AvgPriority*10+padding))
            .attr("cy", d => y(d.running.waitingTime*10+padding))*/
   //     }
  //  }
}
function scatterPlot(svg,scheduler,accessor) {
       const NumberOfGraph = 1;
    const width = 1000, height = 1000;
   const padding = ((height/NumberOfGraph)*0.15),size = ((height/NumberOfGraph)*0.85);   
     var x = d3.scaleLinear()
                    .range([padding / 2, size - padding / 2])
                    .domain([0,4]);

    var y = d3.scaleLinear()
                .range([size - padding / 2, padding / 2])
                .domain([0,4]);
     //MAKING Y AXIS        
    var yAxis = d3.axisLeft(y);
    //MAKING X AXIS  
    var xAxis = d3.axisBottom(x);


    const jobJoin = svg.selectAll("g.axis")
                       .data([0])

    const jobEnter = jobJoin.enter()
    //Making x Axis
    jobEnter.append("g")
            .classed("axis x",true)
            .attr("transform", `translate(${100},${500})`)
            .call(xAxis)

     // Making y Axis      
     jobEnter.append("g")
            .classed("axis y",true)
            .attr("transform",`translate(${100},${100})`)
            .call(yAxis)

    scatterPlotDots(svg,scheduler,accessor)
}

function scatterPlotDots(svg,scheduler,accessor){
     const NumberOfGraph = 1;
    const width = 1000, height = 1000;
   const padding = ((height/NumberOfGraph)*0.15),size = ((height/NumberOfGraph)*0.85);   
     const x = d3.scaleLinear()
                    .range([padding / 2, size - padding / 2])
                    .domain([0,4]);

    const y = d3.scaleLinear()
                .range([size - padding / 2, padding / 2])
                .domain([0,4]);

    const update = svg.selectAll("circle.job")
                      .classed("job",true)
                      .data(scheduler.finishedJobs)
    
    const enter = update.enter()

    enter.append("circle")  
         .classed("job",true)
         .attr("r", 3)
         .attr("cx", d => x(accessor.getX(d)))
         .attr("cy", d => y(accessor.getY(d)))

}   

