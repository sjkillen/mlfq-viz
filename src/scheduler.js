/**
 * Creates an instance of the mlfq scheduler
 */

import Scheduler from "./mlfq";

import random from "random-seed";

export default
new Scheduler({
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
    ioFrequencyRange: [0, 5],
    jobRuntimeRange: [10, 100],
    numJobsRange: [100, 1000],
    jobCreateTimeRange: [0, 3000],
    ioLengthRange: [10, 10]
});