/**
 * Creates accessors for different views to use to get at job data
 */

import * as d3 from "d3";



const colours = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(3));

/**
 * Collection of props that can be accessed from jobs
 * .access(job) -> return value of prop
 * .label -> text display of prop
 * .calcDomain(scheduler) -> return domain of value [min, max]
 */
export const props = {
    [".init.ioFreq"]: {
        access(d) {
            return d.init.ioFreq;
        },
        label: "IO Frequency",
        tooltip: "A job's IO Frequency is how many cycles a job will run on the CPU before being interupted and moved to IO. Interactive jobs have high IO Frequency, while CPU bound jobs will have low IO frequency",
        legend: ["Low IO Freq.", "High IO Freq."],
        calcDomain(scheduler) {
            return [d3.max(scheduler.allJobs, d => d.init.ioFreq), 0]
        },
        colour: colours(0)
    },
    [".perf.responseTime"]: {
        access(d) {
            return d.perf.responseTime;
        },
        label: "Response Time",
        legend: ["Quick Response", "Slow Response"],
        tooltip: "A job's Response Time is the measured number of CPU cycles from when a job first entered the system to when it was first run on the CPU",
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
        tooltip: "A job's Turnaround Time time is the measured number of CPU cycles from when the job entered the system to when it finished and left the system",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.perf.turnaroundTime)]
        }
    },
    [".running.serviceTime"]: {
        access(d) {
            return d.running.serviceTime;
        },
        label: "Service Time",
        tooltip: "Service Time is amount of cycles a job has been run on the CPU.",
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
        tooltip: "Total Waiting Time is the amount of CPU cycles a job has spent waiting in a queue",
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
        tooltip: "Average Priority represents the queue a job has spent the most time in",
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
        tooltip: "Run Time is the number of cycles a job needs to be run on the CPU to be completed",
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
        tooltip: "Create time stores the CPU cycle number that a job entered (or will enter) the simulation at",
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
        tooltip: "IO length is a fixed number of CPU cycles that will pass after a job has entered IO before the job leaves IO",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.ioLength)]
        },
        colour: colours(1)
    },
    ["tq"]: {
        label: "Time Quantum",
        legend: ["Barely Depleted", "Almost Depleted"],
        colour: colours(2)
    },
    ["timeQuantum"]: {
        access(d) {
            return `${d.running.quantumFull-d.running.quantumLeft} / ${d.running.quantumFull}`;
        },
        label: "Time Quantum",
        tooltip: "Time Quantum the number of cycles a job may run on the CPU before being kicked off and deprioritized"
    },
    ["none"]: {
        access(d) {
            return 0;
        },
        label: "None",
        tooltip: "This is a blank attribute... Why are you reading this?",
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
        tooltip: "The MLFQ algorithm decides which job to run based on priority. The highest priority waiting job is always selected to be run on the CPU",
        legend: ["Low Priority!!!&", "High Priority"],
        calcDomain(scheduler) {
            return [0, scheduler.numQueues]
        }
    },
    ["none&priority=greyscale"]: {
        label: "Priority (Greyscale)",
        legend: ["High Priority!!!!", "Low Priority"],
    },
    ["tq&priority=greyscale"]: {
        label: "Time Quantum & Priority (Greyscale)",
        legend: ["Barely Depleted", "Almost Depleted"],
    },
    ["none&priority=rainbow"]: {
        label: "Priority (Coloured)",
        legend: ["Low Priority*(&^*", "High Priority"],
    },
    ["tq&priority=rainbow"]: {
        label: "Time Quantum & Priority (Coloured)",
        legend: ["Barely Depleted", "Almost Depleted"],
    }
};

/**
 * Create an accessor factory for an axis
 * @param axis X, Y, Z, etc
 * gets appended to method names ie getX
 */
function propSetter(axis) {
    return function (propName) {
        if (!(propName in props)) propName = "none";
        const { access, label, calcDomain, colour, legend, tooltip } = props[propName];
        this.accessors["get" + axis] = access;
        this.accessors["getDomain" + axis] = calcDomain;
        this.accessors["label" + axis] = label;
        this.accessors["colour" + axis] = colour;
        this.accessors["legend" + axis] = legend;
        this.accessors["tooltip" + axis] = tooltip;
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
 * Get accessors
 */
function *getAccessors(props) {
    for (const prop of props) {
        yield accessorFactoryFactory()
            .y(prop)
            .accessors;
    }
}

export function accessorMatrix(props) {
    return [...accessorMatrix2d(props)];
}

export function accessorParallelAxis(props){
    return [...getAccessors(props)];

}