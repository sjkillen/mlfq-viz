/**
 * Creates an instance of the mlfq scheduler
 */

import Scheduler from "./mlfq";

import random from "random-seed";

const scheduler = new Scheduler({
    timeQuantums: [1, 2, 3, 4],
    boostTime: 10,
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
    ioFrequencyRange: [0, 0],
    jobRuntimeRange: [3, 10],
    numJobsRange: [5, 10],
    jobCreateTimeRange: [0, 100],
    ioLengthRange: [, 0]
});
window.scheduler = scheduler; // TODO remove
export default scheduler;