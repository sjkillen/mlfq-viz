/**
 * Creates an instance of the mlfq scheduler
 */

import Scheduler from "./mlfq";

import random from "./randomAdapter";

const scheduler = new Scheduler({
    timeQuantums: [5, 5, 5, 5, 5, 5, 5, 5],
    boostTime: Infinity,
    resetTQsOnIO: false,
    random,
    speed: 3000,
    generation: [
        {
            ioFrequencyRange: [80, 100],
            jobRuntimeRange: [Infinity, Infinity],
            numJobsRange: [1, 1],
            jobCreateTimeRange: [10, 10],
            ioLengthRange: [5, 5]
        },
        {
            ioFrequencyRange: [33, 80],
            jobRuntimeRange: [Infinity, Infinity],
            numJobsRange: [1, 1],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [0, 0]
        }
    ]
});
export default scheduler;