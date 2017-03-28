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
            return [0,d3.max(scheduler.allJobs, d => d.init.ioFreq)]
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
    ["none"]: {
        access(d) {
            return 0;
        },
        label: "No property selected",
        calcDomain(scheduler) {
            return [0, 0];
        }
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
        const { access, label, calcDomain } = props[propName];
        this.accessors["get" + axis] = access;
        this.accessors["getDomain" + axis] = calcDomain;
        this.accessors["label" + axis] = label;
        return this;
    };
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
function *getCombinations2(props) {
    for (let i = 0; i < props.length - 1; i++) {        
        for (let j = i + 1; j < props.length; j++) {
            yield [props[i], props[j]];
        }
    }
}

/**
 * Yield all accessors needed for a matrix
 * Used for the SPLOM
 */
function *accessorMatrix2d(props) {
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