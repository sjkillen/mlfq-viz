
import Scheduler from "./mlfq";

const scheduler = new Scheduler({
    timeQuantums: [1,1,1,1,1,1,1,1],
    boostTime: Infinity,
    resetTQsOnIO: false,
    speed: 1000,
    generation: [
        {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [1, 1],
            numJobsRange: [-1, -1],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [0, 0]
        }
    ]
});
export default scheduler;

window.scheduler = scheduler;