/**
 * Creates an instance of the mlfq scheduler
 */

import Scheduler from "./mlfq";

import random from "random-seed";

const scheduler = new Scheduler({
    timeQuantums: [1, 2, 3, 4],
    boostTime: 50,
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
    ioFrequencyRange: [100, 1000],
    jobRuntimeRange: [1, 10],
    numJobsRange: [1, 1],
    jobCreateTimeRange: [1, 3],
    ioLengthRange: [0, 10]
});
export default scheduler;