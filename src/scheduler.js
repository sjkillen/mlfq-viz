
import Scheduler from "./mlfq";

const scheduler = new Scheduler({
    timeQuantums: [50, 5, 5, 5, 5, 5, 5, 5],
    boostTime: Infinity,
    resetTQsOnIO: false,
    speed: 1000,
    generation: [
        {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [100, 200],
            numJobsRange: [10, 10],
            jobCreateTimeRange: [5, 10],
            ioLengthRange: [50, 100]
        },
        {
            ioFrequencyRange: [30, 40],
            jobRuntimeRange: [60, 1000],
            numJobsRange: [1, 1],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [1, 49]
        }
    ]
});
export default scheduler;

window.scheduler = scheduler;