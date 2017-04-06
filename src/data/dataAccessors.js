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
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.ioFreq)]
        }
    },
    [".perf.responseTime"]: {
        access(d) {
            return d.perf.responseTime;
        },
        label: "Response Time",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.perf.responseTime)]
        }
    },
    [".perf.turnaroundTime"]: {
        access(d) {
            return d.perf.turnaroundTime;
        },
        label: "Turnaround Time",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.perf.turnaroundTime)]
        }
    },
    [".running.serviceTime"]: {
        access(d) {
            return d.running.serviceTime;
        },
        label: "Service Time",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.running.serviceTime)]
        }
    },
    [".running.totalWaitingTime"]: {
        access(d) {
            return d.running.totalWaitingTime;
        },
        label: "Total Waiting Time",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.running.totalWaitingTime)]
        }
    },
    [".running.avgPriority"]: {
        access(d) {
            return d.running.avgPriority;
        },
        label: "Average Priority",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.running.avgPriority)]
        }
    },
    [".init.runTime"]: {
        access(d) {
            return d.init.runTime;
        },
        label: "Run Time",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.runTime)]
        }
    },
    [".init.createTime"]: {
        access(d) {
            return d.init.createTime;
        },
        label: "Create Time",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.createTime)]
        }
    },
    [".init.ioLength"]: {
        access(d) {
            return d.init.ioLength;
        },
        label: "Job IO Length",
        calcDomain(scheduler) {
            return [0, d3.max(scheduler.allJobs, d => d.init.ioLength)]
        }
    },
    ["tq"]: {
        label: "Time Quantum"
    },
    ["none"]: {
        access(d) {
            return 0;
        },
        label: "None",
        calcDomain(scheduler) {
            return [0, 0];
        }
    },
    [".running.priority"]: {
        access(d) {
            return d.running.priority;
        },
        label: "Priority",
        calcDomain(scheduler) {
            return [0, scheduler.numQueues]
        }
    },
    ["none&priority=greyscale"]: {
        label: "Priority (Greyscale)"
    },
    ["tq&priority=greyscale"]: {
        label: "Time Quantum & Priority (Greyscale)"
    },
    ["none&priority=rainbow"]: {
        label: "Priority (Coloured)"
    },
    ["tq&priority=rainbow"]: {
        label: "Time Quantum & Priority (Coloured)"
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
        const { access, label, calcDomain, colour } = props[propName];
        this.accessors["get" + axis] = access;
        this.accessors["getDomain" + axis] = calcDomain;
        this.accessors["label" + axis] = label;
        this.accessors["colour" + axis] = colour;
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