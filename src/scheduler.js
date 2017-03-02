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
    ioFrequencyRange: [0, 10],
    jobRuntimeRange: [3, 300],
    numJobsRange: [100, 500],
    jobCreateTimeRange: [0, 1000],
    ioLengthRange: [3, 300]
});
window.scheduler = scheduler; // TODO remove
export default scheduler;