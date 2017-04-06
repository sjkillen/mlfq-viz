/**
 * Render the Scheduler Panel
 */

import React, { Component } from "react";
import * as d3 from "d3";
import { Container } from "flux/utils";
import SchedulerStore from "../data/SchedulerStore";
import "./SchedulerPanel.scss";
import "./PlaybackControl.scss";
import * as anim from "./schedulerAnimations";
import { selectJob, setJobFillAttribute, playback, setPlayback } from "../data/SchedulerActions";
import { accessorFactoryFactory, getLabel } from "../data/dataAccessors";

window.addEventListener("blur", e => {
   setPlayback(playback.paused);
});

/**
 * Called every state change
 */
class SchedulerPanel extends Component {
   static getStores() {
      return [SchedulerStore];
   }
   static calculateState(prevState) {
      return SchedulerStore.getScheduler();
   }
   componentWillUnmount() {
      setPlayback(playback.paused);
   }
   render() {
      const scheduler = this.state;
      return (
         <span className="SchedulerPanel">
            <div className="container">
               <svg
                  shapeRendering="geometricPrecision"
                  ref={el => update(el, scheduler)}
                  className="image">
               </svg>
               <div className="controls">
                  <select value={scheduler.fillAttr} onChange={e => setJobFillAttribute(e.target.value)}>
                     {scheduler.displayAttr.map((attr, i) => {
                        return (<option key={i} value={attr}>{getLabel(attr)}</option>)
                     })}
                  </select>
                  <div>
                     <PlaybackControl disableStates={[playback.stepping, playback.restarting]} currMode={scheduler.playMode} mode={playback.playing}>Play</PlaybackControl>
                     <PlaybackControl disableStates={[playback.stepping, playback.restarting]} currMode={scheduler.playMode} mode={playback.paused}>Pause</PlaybackControl>
                     <PlaybackControl disableStates={[playback.stepping, playback.restarting]} currMode={scheduler.playMode} mode={playback.stepping}>Step</PlaybackControl>
                     <PlaybackControl disableStates={[playback.stepping]} currMode={scheduler.playMode} mode={playback.restarting}>Restart</PlaybackControl>
                  </div>
               </div>
            </div>
         </span>
      );
   }
}

export default Container.create(SchedulerPanel);

function PlaybackControl({ mode, children, currMode, disableStates }) {
   let addClass = currMode === mode ? " active" : " inactive";
   let disabled = false;
   if (disableStates.indexOf(currMode) !== -1) {
      addClass += " disabled";
      disabled = true;
   }
   return (
      <span className="PlaybackControl">
         <button className={addClass} onClick={e => {
            if (disabled) return;
            setPlayback(mode)
         }}>
            {children}
         </button>
      </span>
   );
}

/**
 * Performs the d3 lifecycle for jobs
 */
function jobLife(svg, scheduler, scales) {
   const jobJoin = svg
      .selectAll("g.job")
      .data(scheduler.allJobs, d => d.init.id)
   jobJoin
      .call(drawJob, scheduler, scales)
   jobJoin
      .call(jobClockFill, scheduler, scales);
   jobJoin
      .call(jobFillup, scheduler, scales);
   jobJoin.selectAll(".back")
      .call(colourPriority, scheduler, scales)
   const group = jobJoin.enter()
      .append("g")
      .classed("job", true)
      .on("click", selectJob)
   group.append("circle")
      .classed("border", true)

   group.append("circle")
      .classed("back", true)
      .call(colourPriority, scheduler, scales)
   group.call(drawJob, scheduler, scales)
   group.append("circle")
      .classed("clockfill", true)
      .call(jobClockFill, scheduler, scales);
   group.call(makeFillupGradient, scheduler, scales)
   group.append("circle")
      .classed("fillup", true)
      .call(jobFillup, scheduler, scales);
   jobJoin.exit().remove();
   return jobJoin;
}

function colourPriority(job, scheduler, scales) {
   return job.attr("fill", d =>
      scales.priority(scales.getJobPriority(d))
   )
}

function makeFillupGradient(group, scheduler, scales) {
   const gradient = group.append("linearGradient")
      .attr("id", scales.fillup.gradId)
      .attr("x1", "0.5")
      .attr("x2", "0.5")
      .attr("y1", "1")
      .attr("y2", "0")

   gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-opacity", 1)
      .attr("stop-color", "blue")
   gradient.append("stop")
      .classed("move", true)
      .attr("offset", "50%")
      .attr("stop-opacity", 1)
      .attr("stop-color", "blue")
   gradient.append("stop")
      .classed("move", true)
      .attr("offset", "50%")
      .attr("stop-opacity", 0)
   gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-opacity", 0)
   return gradient;
}

/**
 * Generate all the needed scales
 */
function getScales(svg, scheduler) {
   const maxQueueHeight = 7;
   const marginBottom = 200;
   const marginTop = 150;
   const marginSides = 400;
   const width = 1200;
   const height = 700;
   const queuePad = 5;
   const jobPad = 5;
   const jobHeight = d3.scaleBand()
      .domain(d3.range(maxQueueHeight))
      .range([height - marginBottom, marginTop]);
   const queueWidth = jobHeight.bandwidth();
   const radius = queueWidth / 2;

   const timerFull = Math.PI * radius;
   const timerScales = scheduler.queues.map(q => {
      return d3.scaleLinear()
         .domain([q.timeQuantum, 0])
         .range([0, timerFull])
   });
   const timer = job => {
      const perc = timerScales[job.running.priority](job.running.quantumLeft)
      return `${perc}, ${timerFull}`;
   }

   const queueTop = jobHeight(maxQueueHeight - 1) - radius;
   const queue = d3.scaleBand()
      .domain(d3.range(scheduler.numQueues))
      .range([marginSides, (scheduler.numQueues * queueWidth) + marginSides])
   const jobQueue = queue.paddingInner(jobPad);
   const cpu = {
      x: marginSides + queueWidth * 2,
      y: height - marginBottom + queueWidth * 2,
      textX: marginSides + queueWidth * 3,
      tickTextX: marginSides + queueWidth * 5.5
   };
   const queueBottom = jobHeight(0) + radius + queuePad;
   const queueHeight = queueBottom - queueTop;
   const drawQueue = p => queue(p) - (queueWidth + queuePad) / 2;
   const requeue = {
      upperPipeJob: queueTop - radius,
      sidePipeJob: queue(scheduler.numQueues - 1) + queueWidth,
      lowerPipeJob: cpu.y + queueWidth + radius,
      lowerWidth: queue(scheduler.numQueues - 1) + queueWidth * 2 - marginSides,
      lowerHeight: queueWidth,
      lowerLeft: drawQueue(0),
      lowerUp: cpu.y + queueWidth,
      middleUp: queueBottom,
      upperUp: queueTop - queueWidth,
      middleJobUp: queueBottom + radius,
      rightLeftStart: queue(scheduler.numQueues - 1) + queueWidth - radius,
      rightUpStart: queueTop,
      leftJob: queue(0),
      rightWidth: queueWidth,
      rightHeight: queueHeight + queueWidth * 4,
      leftHeight: (cpu.y + queueWidth) - queueBottom
   };
   const io = {
      up: requeue.middleUp,
      left: requeue.lowerLeft - queueWidth * 5,
      height: requeue.leftHeight + queueWidth,
      width: queueWidth * 5,
      textX: requeue.lowerLeft - queueWidth * 3,
      textY: requeue.middleUp + queueWidth,
      jobY: cpu.y,
      jobX: requeue.lowerLeft - queueWidth * 3,
   }
   const legend = {
      x: io.left + 50,
      y: io.up - 75
   };
   const dead = {
      exit: requeue.sidePipeJob + radius * 3
   }
   const access = buildAccessor(scheduler);
   return {
      // x Position a queue needs to be draw
      queue: drawQueue,
      // x Position a job in queue needs to be drawn
      jobQueue: queue,
      queueWidth: queueWidth + queuePad,
      queueHeight,
      queueBottom,
      queueTop,
      radius,
      width,
      height,
      legend,
      cpu,
      io,
      getJobPriority: d => d.running.priority,
      access,
      timer,
      priority: priorityScale(scheduler, access),
      dead,
      fillup: fillupScales(scheduler, access),
      fillColour: access.colourX,
      requeue,
      finished: () => 0,
      // Takes job's queue position and outputs its y position
      queueOrder: jobHeight
   };
}

function priorityScale(scheduler, access) {
   if (!access.getY) return d => "white";
   const bins = scheduler.numQueues + 1;
   let scale;
   if (access.shading === "rainbow") {
      if (bins <= 10) {
         scale = d3.scaleOrdinal(d3.schemeCategory10);
      } else {
         scale = d3.scaleOrdinal(d3.schemeCategory20);
      }
      scale = scale.domain(d3.range(bins));
   } else {
      scale = d3.scaleLinear()
         .domain([0, bins])
         .range(["#FFF", "#111"])
   }
   return scale;
}

/**
 * Scales for the fill up attr
 */
function fillupScales(scheduler, access) {
   const gradId = d => `jobfillup-grad-${d.init.id}`;
   if (!access.getX) {
      return {
         attr: d => 0,
         gradId
      }
   }
   const clamp = d3.scaleLinear()
      .domain(access.getDomainX(scheduler))
      .range([0, 100]);
   return {
      attr: d => clamp(access.getX(d)),
      gradId
   }
}

function buildAccessor(scheduler) {
   const attr = scheduler.fillAttr;
   let access
   if (attr.match("priority")) {
      const [other] = attr.split("&");
      scheduler.fillAttr = other || "none";
      access = accessorFactoryFactory()
         .x(other)
         .y(".running.priority")
         .accessors;
      access.usePriority = true;
      if (attr.match("greyscale")) {
         access.shading = "greyscale";
      } else {
         access.shading = "rainbow";
      }
   }
   else {
      access = accessorFactoryFactory()
         .x(attr)
         .accessors;
   }
   if (attr.match("tq")) {
      access.useTQ = true;
   }
   if (attr === "none") {
      access.none = true
   }
   if (!access.useTQ && !access.usePriority && !attr.match("none")) {
      access.useFill = true;
   }
   return access
}

/**
 * Get the array that contains a job
 */
function getJobHolster(job, scheduler) {
   switch (job.state) {
      case "waiting":
      case "cpu":
         return scheduler.queues[job.running.priority].jobs;
      case "future":
         return scheduler.futureJobs;
      case "io":
         return scheduler.ioJobs;
      case "finished":
         return scheduler.finishedJobs;
      default:
         throw new Error("no holster");
   }
}

/**
 * Get the array that contains a job
 */
function getJobHolster(job, scheduler) {
   switch (job.state) {
      case "waiting":
      case "cpu":
         return scheduler.queues[job.running.priority].jobs;
      case "future":
         return scheduler.futureJobs;
      case "io":
         return scheduler.ioJobs;
      case "finished":
         return scheduler.finishedJobs;
      default:
         throw new Error("no holster");
   }
}

/**
 * Get the position of a job in it's queue
 * @param job
 * @param scheduler
 * @returns the position of the job in it's queue (future, io, waiting, cpu)
 */
function getJobPosition(job, scheduler) {
   const holster = getJobHolster(job, scheduler);
   const position = holster.map(
      j => j.init.id)
      .indexOf(job.init.id);
   if (position === -1) {
      return Infinity;
   }
   return position;
}

/**
 * Encodes a timer inside a circle, for TQs
 * @param {d3 selection} job element to fill
 * @param scheduler
 * @param scales
 */
function jobClockFill(group, scheduler, scales) {
   return group.select("circle.clockfill")
      .attr("visibility", scheduler.fillAttr === "tq" ? "visible" : "hidden")
      .attr("r", scales.radius / 2)
      .style("stroke", d => {
         let fill = scales.fillColour;
         if (scales.access.usePriority) {
            fill = scales.priority(scales.getJobPriority(d) + 1);
         }
         return fill;
      })
      .style("stroke-width", `${scales.radius}px`)
      .attr("stroke-dasharray", d => scales.timer(d))
}

/**
 * Encodes an attribute inside the job
 * @param {d3 selection} job element to fill
 * @param scheduler
 * @param scales
 */
function jobFillup(group, scheduler, scales) {
   group.selectAll("stop.move")
      .attr("offset", d => `${scales.fillup.attr(d)}%`)
   group.selectAll("stop").attr("stop-color", scales.fillColour)
   return group.select("circle.fillup")
      .attr("visibility", scales.access.getY ? "hidden" : "visible")
      .attr("r", scales.radius)
      .attr("fill", d => `url(#${scales.fillup.gradId(d)})`)
}

/**
 * Draw the scheduler's queues and the jobs inside them
 * @param element to draw the queues inside
 * @param scheduler
 * @param scales from getScales
 */
function drawJob(selection, scheduler, scales) {
   selection.selectAll("circle").attr("r", d => scales.radius + "px")
   return selection
      .attr("data-state", d => d.state)
      .attr("data-selected", function (d) {
         if (d.init.id === scheduler.selectedJobId) {
            // Move job to front
            this.parentNode.appendChild(this);
            return true;
         }
      })
      .each(function (d) {
         // Job animations get messed up if redrawn mid animation
         if (!scheduler.changed) return;
         const pos = getJobPosition(d, scheduler);
         const y = scales.queueOrder(pos);
         const job = d3.select(this);

         switch (d.prevState + "|" + d.state) {
            case "future|future":
               job.call(anim.waitInFuture, scheduler, scales);
               return;
            case "future|waiting":
               job.call(anim.enterSimulation, scheduler, scales, y);
               return;
            case "future|cpu":
               job.call(anim.enterSimulationToCPU, scheduler, scales, y);
               return;
            case "waiting|waiting":
               job.call(anim.queueMove, scheduler, scales, y);
               return;
            case "waiting|cpu":
               job.call(anim.queueToCPU, scheduler, scales);
               return;
            case "cpu|finished":
               job.call(anim.finishJob, scheduler, scales);
               return;
            case "cpu|waiting":
               job.call(anim.requeueJob, scheduler, scales, y);
               return;
            case "cpu|io":
               job.call(anim.enterIO, scheduler, scales);
               return;
            case "io|waiting":
               job.call(anim.leaveIO, scheduler, scales, y);
               return;
            case "io|cpu":
               job.call(anim.leaveIOToCPU, scheduler, scales);
               return;
         }
      });
}

/**
 * Draw the queues to hold jobs
 */
function queues(svg, scheduler, scales) {
   const join = svg.selectAll("rect.queue").data(scheduler.queues);
   join.call(singleQueue, scheduler, scales)
   join.enter()
      .append("rect")
      .classed("queue", true)
      .call(singleQueue, scheduler, scales)
   join.exit().remove();
}

function singleQueue(queue, scheduler, scales) {
   return queue.attr("fill", d => {
      if (scales.access.usePriority) {
         let colour = scales.priority(d.priority);
         if (scales.access.shading === "rainbow") {
            colour = d3.color(colour);
            colour = colour.brighter(0.25);
            colour = colour.rgb();
         }
         return colour;
      } else {
         return "white";
      }
   })
      .attr("width", scales.queueWidth)
      .attr("height", scales.queueHeight)
      .attr("x", d => scales.queue(d.priority))
      .attr("y", scales.queueTop)
}

/**
 * Draw the pipe that requeues jobs and the one from queue to cpu
 */
function requeuePipe(svg, scheduler, scales) {
   const update = svg.selectAll("g.requeueGroup").data([1]);
   const join = update.enter().append("g").classed("requeueGroup", true);
   join.append("rect").classed("requeue lower", true)
      .call(lower)

   update.selectAll(".lower").call(lower)
      .call(lower)
   function lower(rect) {
      return rect
         .attr("width", scales.requeue.lowerWidth)
         .attr("height", scales.requeue.lowerHeight)
         .attr("x", scales.requeue.lowerLeft)
         .attr("y", scales.requeue.lowerUp)
   }
   join.append("rect").classed("requeue middle", true)
      .call(middle)
   update.selectAll(".middle").call(middle)
   function middle(rect) {
      return rect
         .attr("width", scales.requeue.lowerWidth)
         .attr("height", scales.requeue.lowerHeight)
         .attr("x", scales.requeue.lowerLeft)
         .attr("y", scales.requeue.middleUp)
   }
   join.append("rect").classed("requeue upper", true)
      .call(upper)
   update.selectAll(".upper").call(upper)
   function upper(rect) {
      return rect
         .attr("width", scales.requeue.lowerWidth)
         .attr("height", scales.requeue.lowerHeight)
         .attr("x", scales.requeue.lowerLeft)
         .attr("y", scales.requeue.upperUp)
   }
   join.append("rect").classed("requeue right", true)
      .call(right)
   update.selectAll(".right").call(right)
   function right(rect) {
      return rect
         .attr("width", scales.requeue.rightWidth)
         .attr("height", scales.requeue.rightHeight)
         .attr("x", scales.requeue.rightLeftStart)
         .attr("y", scales.requeue.rightUpStart)
   }
   join.append("rect").classed("requeue pipe", true)
      .call(pipe)
   update.selectAll(".pipe").call(pipe);
   function pipe(rect) {
      return rect
         .attr("width", scales.requeue.rightWidth)
         .attr("height", scales.requeue.leftHeight)
         .attr("x", scales.requeue.lowerLeft)
         .attr("y", scales.requeue.middleUp)
   }
}

/**
 * Draw the CPU
 */
function cpu(svg, scheduler, scales) {
   const update = svg.selectAll("g.cpu").data([1])
   const enter = update.enter()
      .append("g")
      .classed("cpu", true)

   enter.append("text")
      .classed("title", true)
      .attr("x", scales.cpu.textX)
      .attr("y", scales.cpu.y)
      .text("CPU")

   enter.append("text")
      .classed("tick", true)
      .attr("x", scales.cpu.tickTextX)
      .attr("y", scales.cpu.y)
      .text(scheduler.globalTick)

   enter.append("circle")
      .classed("slot", true)
      .attr("cx", scales.cpu.x)
      .attr("cy", scales.cpu.y)
      .attr("r", scales.radius)

   update.selectAll(".tick")
      .text(scheduler.globalTick)

}

/**
 * Draw the IO area for jobs in io
 */
function io(svg, scheduler, scales) {
   const update = svg.selectAll("g.io").data([1])
   const enter = update.enter()
      .append("g")
      .classed("io", true)

   enter.append("rect")
      .classed("box", true)
      .attr("x", scales.io.left)
      .attr("y", scales.io.up)
      .attr("width", scales.io.width)
      .attr("height", scales.io.height)

   enter.append("text")
      .classed("title", true)
      .attr("x", scales.io.textX)
      .attr("y", scales.io.textY)
      .text("IO")
}

function legend(svg, scheduler, scales) {
   const update = svg.selectAll("g.legend").data([
      {
         displace: 0,
         init: {
            id: -1
         },
         running: {
            priority: 0,
         },
         clock: 3.7,
         text: 0,
         fill: scales.access.useFill ? 10 : 0
      },
      {
         displace: 2,
         init: {
            id: -2
         },
         running: {
            priority: scales.access.useTQ ? 0 : 5
         },
         clock: 1.3,
         text: 1,
         fill: scales.access.useFill ? 80 : 0
      }
   ], d => d.init.id);
   const mov = 70
   const enter = update.enter().append("g").classed("legend job", true);
   const legendScale = Object.create(scales);
   legendScale.timer = d => `${Math.PI * legendScale.radius / d.clock}, ${Math.PI * legendScale.radius}`;
   legendScale.fillup = Object.create(scales.fillup)
   legendScale.fillup.attr = d => d.fill
   legendScale.radius = 25;
   update.style("transform",
      `translate(${legendScale.legend.x}px, ${legendScale.legend.y}px)`)
   update.selectAll("circle:not(.clockfill)").attr("r", d => legendScale.radius + "px")
      .attr("cx", d => d.displace * mov)
   update.selectAll("circle.clockfill").attr("r", d => legendScale.radius + "px")
      .attr("cy", d => d.displace * mov)
   update.call(colourPriority, scheduler, legendScale)
   update.call(jobClockFill, scheduler, legendScale);
   update.call(jobFillup, scheduler, legendScale);
   update.selectAll(".back")
      .call(colourPriority, scheduler, legendScale)
   const pri = ["Low Priority", "High Priority"];
   enter.style("transform",
      `translate(${legendScale.legend.x}px, ${legendScale.legend.y}px)`)
   enter.append("text")
      .text(d => {
         if (!scales.access.useTQ && scales.access.usePriority) {
            return pri[d.text];
         }
         return legendScale.access.legendX[d.text]
      })
      .attr("text-anchor", "middle")
      .attr("x", d => d.displace * mov)
   enter.append("circle")
      .classed("back", true)
      .call(colourPriority, scheduler, legendScale)
   enter.append("circle")
      .classed("clockfill", true)
      .call(jobClockFill, scheduler, legendScale);
   enter.call(makeFillupGradient, scheduler, legendScale)
   enter.append("circle")
      .classed("fillup", true)

   enter.selectAll("circle:not(.clockfill)").attr("r", d => legendScale.radius + "px")
      .attr("cx", d => d.displace * mov)
   enter.selectAll("circle.clockfill").attr("r", d => legendScale.radius + "px")
      .attr("cy", d => d.displace * mov)

   enter.call(colourPriority, scheduler, legendScale)
   enter.call(jobClockFill, scheduler, legendScale);
   enter.call(jobFillup, scheduler, legendScale);

}

/**
 * Update the drawing
 */
function update(svgElement, scheduler) {
   if (!svgElement) return;
   const svg = d3.select(svgElement);
   const scales = getScales(svg, scheduler);
   svg.attr("height", scales.height)
      .attr("width", scales.width)
   svg.call(requeuePipe, scheduler, scales);
   svg.call(queues, scheduler, scales);
   svg.call(cpu, scheduler, scales);
   svg.call(io, scheduler, scales);
   svg.call(jobLife, scheduler, scales);
   svg.call(legend, scheduler, scales);
}
