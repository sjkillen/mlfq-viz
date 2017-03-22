/**
 * Creates an instance of the mlfq scheduler
 */

import Scheduler from "./mlfq";

import random from "./randomAdapter";

const scheduler = new Scheduler({
    timeQuantums: [5, 5, 5, 5, 5, 5, 5, 5],
    boostTime: Infinity,
    resetTQsOnIO: true,
    random,
    speed: 500,
    generation: [
        {
            ioFrequencyRange: [80, 100],
            jobRuntimeRange: [Infinity, Infinity],
            numJobsRange: [3, 5],
            jobCreateTimeRange: [100, 100],
            ioLengthRange: [5, 5]
        },
        {
            ioFrequencyRange: [-1, -1],
            jobRuntimeRange: [Infinity, Infinity],
            numJobsRange: [5, 5],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [0, 0]
        }
    ]
});
export default scheduler;