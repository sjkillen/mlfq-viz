/**
 * Creates an instance of the mlfq scheduler
 */

import Scheduler from "./mlfq";

import random from "random-seed";

const scheduler = new Scheduler({
    timeQuantums: [5, 6, 7, 8, 9, 10, 11],
    boostTime: 2000,
    random: (function(){
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
    speed: 1500,
    ioFrequencyRange: [-1, -1],
    jobRuntimeRange: [10, 20],
    numJobsRange: [10, 15],
    jobCreateTimeRange: [1, 10],
    ioLengthRange: [10, 30]
});
export default scheduler;