export default
function() {
   console.log("Hey world!");
}

class Job {
    // Values the job is created with
    init: {
        // Time when job was created
        readonly createTime: number;
        // Total time job needs to spend on CPU to finish
        readonly runTime: number;
    }
    // values collected once turing the jobs lifetime
    perf: {
        // Time it took from when job was created to be scheduled
        responseTime: number;
        // total time from when job was created till it finished
        turnaroundTime: number;
    }
    // values that vary as the job runs
    runtime: {
        // Which queue job is in
        priority: number;
        // Time job has spent on the CPU
        serviceTime: number;
        // Value that starts = to time quantum and deplets as job is run
        // Forces a context switch and resets when it reaches 0
        quantumLeft: number;
        // Amount of ticks left to complete io, 0 if job isn't performing io
        ioLeft: number;
    }
}


class Scheduler {
    // How many priority levels
    readonly numQueues: number;
    // How often to boost job priorities
    readonly boostTime: number;
}