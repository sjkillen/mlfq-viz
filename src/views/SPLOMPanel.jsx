/**
 * Render the SPLOMPanel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import SPLOMStore from "../data/SPLOMStore";
import "./SPLOMPanel.scss";
import { selectJob } from "../data/SchedulerActions";
import dispatcher from "../data/dispatcher";


export function selectScatterplot(e) {
    const index = +e.target.value;
    dispatcher.dispatch({
        type: "SELECT_SCATTERPLOT",
        index
    });
}

export default Container.createFunctional(SPLOMPanel, () => [SchedulerStore, SPLOMStore], () => {
    const state = SPLOMStore.getState();
    return {
        scheduler: SchedulerStore.getScheduler(),
        SPLOMAttr: state.accessors,
        selected: state.selected
    }
});

/**
 * Called every state change
 */
function SPLOMPanel({ scheduler, SPLOMAttr, selected }) {
    if (SPLOMAttr.length == 0) {
        return (<span className="SPLOMPanel">Scatterplot not available for this lesson.</span>);
    }
    return (
        <span className="SPLOMPanel">
            <svg ref={(el) => update(el, scheduler, SPLOMAttr[selected])}>
            </svg>
            <select onChange={selectScatterplot}>
                {SPLOMAttr.map((attr, i) =>
                    <option key={attr.fullLabel} value={i}>
                        {attr.labelX} vs. {attr.labelY}
                    </option>
                )}
            </select>
        </span>
    );
}

function sortDomain([a, b]) {
    return a < b ? [b, a] : [a, b];
}

function scales(scheduler, attr) {
    const width = 600;
    const padding = 10;
    const xOffset = 50;
    const xDomain = sortDomain(attr.getDomainX(scheduler));
    const yDomain = sortDomain(attr.getDomainY(scheduler));
    return {
        width, padding, xOffset, xDomain, yDomain,
        xAxisScale: d3.scaleLinear().domain(xDomain).range([width, 0]),
        yAxisScale: d3.scaleLinear().domain(yDomain).range([0, width])
    };
}

function update(svgElement, scheduler, attr) {
    const svg = d3.select(svgElement);
    const jobs = attr.plotable(scheduler.allJobs);
    const scale = scales(scheduler, attr);
    const { width, padding, xOffset } = scale;

    svg.attr("width", width + padding * 3)
        .attr("height", width + padding * 3)

    const viz = svg.selectAll(".container").data([1], d => d);
    viz.enter()
        .append("g")
        .classed("container", true)
        .attr("transform", `translate(${xOffset}, ${padding})`)
        .append("g")
        .classed("jobs", true)
        .attr("transform", `translate(0, ${width}) scale(1, -1)`)
    viz.call(axises, jobs, scale, attr);
    viz.selectAll(".jobs").call(jobDots, jobs, scale, attr);
}

function jobDots(svg, jobs, scale, attr) {
    const update = svg.selectAll(".jobDot")
        .data([0, scale.xDomain[1], scale.yDomain[1]])
    //.data(obs, d => d.init.id);
    const { padding, xOffset, width } = scale;


    update.exit().remove();

    update.enter()
        .append("circle")
        .classed("jobDot", true)
        .attr("r", 10)
        .attr("fill", "blue")

    update
        .attr("cx", d => d  /*attr.getX(d)*/)
        .attr("cy", d => d + 10    /*attr.getY(d)*/)

    return svg;
}

function axises(svg, jobs, scale, attr) {
    const { width, padding, yAxisScale,
        xAxisScale, xOffset, xDomain, yDomain } = scale;
    const yAxis = d3.axisLeft(yAxisScale);
    const xAxis = d3.axisBottom(xAxisScale);
    const stat = svg.selectAll(".axises").data([1]);
    const statUp = stat.enter();

    stat.exit().remove();

    const axises = statUp.append("g").classed("axises", true);

    axises.append("g")
        .classed("y", true);

    axises.append("g")
        .attr("transform", `translate(${xOffset}, ${width + padding})`)
        .classed("x", true);

    svg.selectAll(".axises .y").call(yAxis);
    svg.selectAll(".axises .x").call(xAxis);

    return svg;
}