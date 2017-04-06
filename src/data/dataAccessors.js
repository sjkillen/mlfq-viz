/**
 * Creates accessors for different views to use to get at job data
 */

import * as d3 from "d3";

/**
 * Collection of props that can be accessed from jobs
 * .access(job) -> return value of prop
 * .label -> text display of prop
 * .calcDomain(scheduler) -> return domain of value [min, max]
 */
const props = {
    [".init.ioFreq"]: {
        access(d) {
            return d.init.ioFreq;
        },
        label: "IO Frequency",
        legend: ["Low IO Freq.", "High IO Freq."],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.ioFreq)]
        }
    },
    [".perf.responseTime"]: {
        access(d) {
            return d.perf.responseTime;
        },
        label: "Response Time",
        legend: ["Quick Response", "Slow Response"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.perf.responseTime)]
        }
    },
    [".perf.turnaroundTime"]: {
        access(d) {
            return d.perf.turnaroundTime;
        },
        label: "Turnaround Time",
        legend: ["Short Turnaround", "Long Turnaround"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.perf.turnaroundTime)]
        }
    },
    [".running.serviceTime"]: {
        access(d) {
            return d.running.serviceTime;
        },
        label: "Service Time",
        legend: ["Little Service Time", "Lots of Service Time"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.running.serviceTime)]
        }
    },
    [".running.totalWaitingTime"]: {
        access(d) {
            return d.running.totalWaitingTime;
        },
        label: "Total Waiting Time",
        legend: ["Little Waiting", "Lots of Waiting"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.running.totalWaitingTime)]
        }
    },
    [".running.avgPriority"]: {
        access(d) {
            return d.running.avgPriority;
        },
        label: "Average Priority",
        legend: ["Usually Low Priority", "Usually High Priority"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.running.avgPriority)]
        }
    },
    [".init.runTime"]: {
        access(d) {
            return d.init.runTime;
        },
        label: "Run Time",
        legend: ["Short Job", "Long Job"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.runTime)]
        }
    },
    [".init.createTime"]: {
        access(d) {
            return d.init.createTime;
        },
        label: "Create Time",
        legend: ["Early Job", "Late Job"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.createTime)]
        }
    },
    [".init.ioLength"]: {
        access(d) {
            return d.init.ioLength;
        },
        label: "Job IO Length",
        legend: ["Short IO", "Long IO"],
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.ioLength)]
        }
    },
    ["tq"]: {
        label: "Time Quantum",
        legend: ["Barely Depleted", "Almost Depleted"],
    },
    ["none"]: {
        access(d) {
            return 0;
        },
        label: "None",
        legend: ["No Encoding", ""],
        calcDomain(scheduler) {
            return [0, 0];
        }
    },
    [".running.priority"]: {
        access(d) {
            return d.running.priority;
        },
        label: "Priority",
        legend: ["Low Priority", "High Priority"],
        calcDomain(scheduler) {
            return [0, scheduler.numQueues]
        }
    },
    ["none&priority=greyscale"]: {
        label: "Priority (Greyscale)",
        legend: ["Low Priority", "High Priority"],
    },
    ["tq&priority=greyscale"]: {
        label: "Time Quantum & Priority (Greyscale)",
        legend: ["Barely Depleted", "Almost Depleted"],
    },
    ["none&priority=rainbow"]: {
        label: "Priority (Coloured)",
        legend: ["Low Priority", "High Priority"],
    },
    ["tq&priority=rainbow"]: {
        label: "Time Quantum & Priority (Coloured)",
        legend: ["Barely Depleted", "Almost Depleted"],
    }
};

let i = 0;
const colours = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(Object.keys(props).length));
for (const prop in props) {
    props[prop].colour = colours(i++);
}
/**
 * Create an accessor factory for an axis
 * @param axis X, Y, Z, etc
 * gets appended to method names ie getX
 */
function propSetter(axis) {
    return function (propName) {
        if (!(propName in props)) propName = "none";
        const { access, label, calcDomain, colour, legend } = props[propName];
        this.accessors["get" + axis] = access;
        this.accessors["getDomain" + axis] = calcDomain;
        this.accessors["label" + axis] = label;
        this.accessors["colour" + axis] = colour;
        this.accessors["legend" + axis] = legend;
        return this;
    };
}

export function getLabel(key) {
    return props[key].label;
}

/**
 * Create a factory for creating all needed acessor factories
 */
export function accessorFactoryFactory() {
    return {
        accessors: {},
        x: propSetter("X"),
        y: propSetter("Y"),
        z: propSetter("Z"),
        w: propSetter("W")
    }
}

/**
 * Yields every combination for values in an array
 * @example ["a", "b", "c"] -> [["a", "b"], ["a", "c"], ["b", "c"]]
 * @param props to combine 
 */
function* getCombinations2(props) {
    for (let i = 0; i < props.length; i++) {
        for (let j = 0; j <= i; j++) {
            yield [props[j], props[i]];
        }
    }
}

/**
 * Yield all accessors needed for a matrix
 * Used for the SPLOM
 */
function* accessorMatrix2d(props) {
    for (const [propX, propY] of getCombinations2(props)) {
        yield accessorFactoryFactory()
            .x(propX)
            .y(propY)
            .accessors;
    }
}
/**
 * Yield all accessors needed for a PA
 * Used for the PA
 */
function* accessorPA(props) {
    for (const [propX, propY] of getCombinations2(props)) {
        yield accessorFactoryFactory()
            .x(propX)
            .y(propY)
            .accessors;
    }
}
export function accessorMatrix(props) {
    return [...accessorMatrix2d(props)];
}

export function accessorParallelAxis(props) {
    return [...accessorPA(props)];
}