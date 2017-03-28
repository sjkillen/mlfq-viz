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
    speed: 1,
    generation: [
        {
            ioFrequencyRange: [80, 100],
            jobRuntimeRange: [2,10],
            numJobsRange: [3, 150],
            jobCreateTimeRange: [2, 10],
            ioLengthRange: [5, 5]
        },
        {
            ioFrequencyRange: [-1, -1],
            jobRuntimeRange: [2,10],
            numJobsRange: [5, 100],
            jobCreateTimeRange: [1, 10],
            ioLengthRange: [0, 0]
        }
    ]
});
export default scheduler;