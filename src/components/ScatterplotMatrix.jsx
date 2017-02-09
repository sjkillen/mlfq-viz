/**
 * Scatterplot Matrix display
 */

import scheduler from "../scheduler";


import { Component } from "react";
import * as d3 from "d3";

export default
class ScatterplotMatrix extends Component {
    constructor(props) {
        super(props);
        this.svgWidth = 500;
        this.svgHeight = 500;
        scheduler.generateJobs();
        this.jobs = scheduler.futureJobs;
    }
    render() {
        return (
            <span className="ScatterplotMatrix">
                <Scatterplot width={500} height={500} jobs={this.jobs} / >
            </span>
        );
    }
}

class Scatterplot extends Component {
    render() {
        this.svgWidth = this.props.width;
        this.svgHeight = this.props.height;
        this.jobs = this.props.jobs;
        return (
            <span className="Scatterplot">
                <svg className="image">
                    
                </svg>
            </span>
        );
    }
    componentDidMount() {
        this.update();
    }
    update() {
        const svg = d3.select(".Scatterplot .image")
            .attr("height", this.svgHeight)
            .attr("width", this.svgWidth);
        const join = svg.append("g")
            .selectAll("circle")
            .data(this.jobs);
        join.enter()
            .append("circle")
                .attr("r", "10px")
                .attr("cx", 100)
                .attr("cy", 100)
                .attr("fill", "red");
    }
}
