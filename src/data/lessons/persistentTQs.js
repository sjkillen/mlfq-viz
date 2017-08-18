export default {
    lessonName: "PERSISTENT TIME QUANTUMS",
    simulation: {
        timeQuantums: [5, 7, 9, 11, 15, 20, 22, 28],
        boostTime: Infinity,
        resetTQsOnIO: false,
        speed: 1000,
        generation: [
            {
                ioFrequencyRange: [1, 3],
                jobRuntimeRange: [100, 100],
                numJobsRange: [5, 5],
                jobCreateTimeRange: [1, 1],
                ioLengthRange: [3, 3]
            },
        ]
    },
    scheduler: {
        attributes: [
            "tq",
            "tq&priority=greyscale",
        ],
        options: {
            showBoostTimer: false
        }
    },
    splom: {
        attributes: [
        ]
    },
    parallel: {
        attributes: [
        ]
    },
    parameter: {
        "render": true,
        "Scheduler Parameters": {
            "Number of Queues": 8,
            "timeQuantums": [5, 7, 9, 11, 15, 20, 22, 28],
        },
        "Job Generator": {

        },
    },
    details: {
        lesson: [
            {
                message: "Thus far, we've been reseting time quantums when jobs leave the CPU. Unfortunately, a malicious job can game our system by making sure to call IO just before it's Time Quantum expires so that the job is never deprioritized. One way to prevent a job from stealing all of the CPU's time is to keep track of how much Time Quantum a job has depleted. Watch the evil red job that will game the system.",
                atCycle: 1
            },
        ],
        attributes: [
            "timeQuantum",
            ".running.priority",
            ".init.ioFreq"
        ]
    },
    navigation: [
        "scheduler",
        "parameter",
        "details",
        "splom",
        "parallel"
    ]
}