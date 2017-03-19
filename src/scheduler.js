/**
 * Creates an instance of the mlfq scheduler
 */

import Scheduler from "./mlfq";

import random from "random-seed";

const scheduler = new Scheduler({
    timeQuantums: [5, 5, 5, 5, 5, 5, 5, 5],
    boostTime: Infinity,
    resetTQsOnIO: true,
    random: (function () {
        const gen = random.create();
        return {
            seed(seed) {
                gen.seed(seed);
            },
            range(highLow) {
                return gen.intBetween(...highLow);
            }
        };
    }()),
    speed: 200,
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
            numJobsRange: [25, 30],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [0, 0]
        }
    ]
});
export default scheduler;