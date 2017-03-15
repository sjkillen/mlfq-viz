import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import React, { Component } from 'react'
import * as d3 from "d3";


export default Container.createFunctional(ParallelAxis, () => [SchedulerStore], () => {
   return SchedulerStore.getState()
});


var dataset = [
                [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
                [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
              ];

function ParallelAxis(scheduler) {
    const element = <svg></svg>;
    var height = 200;
    var width = 500;
    //x, y
    var margin = {left:50,right:50,top:40,bottom:0};

    var svg = d3.select(element).attr("height", "100%").attr("width", "100%");

    var scaleX = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[0]) + 50])
    .range([0,1000]);

    var scaleY = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[0]) + 50])
    .range([1000,0]);

    var yAxis = d3.axisLeft(scaleY).ticks(8).tickSize(5);
    var xAxis = d3.axisBottom(scaleX);

    var chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")")
    .call(yAxis);

    chartGroup.append("g").call(yAxis);
    chartGroup.append("g")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxis);

    chartGroup.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", d => d[0])
    .attr("cy", d => d[1])
    .attr("r", 30)
    .attr("fill", "black");

    return (
        <span className="SchedulerPanel">
            {element}
        </span>
    );
}


function update(svgElement, scheduler) {

}