export default {
    lessonName: "THE BOOST TIMER",
    simulation: {
        timeQuantums: [2, 1, 2, 1, 2, 1, 3, 2],
        boostTime: 25,
        resetTQsOnIO: false,
        speed: 1000,
        generation: [
            //long job to starve
            {
                ioFrequencyRange: [100, 100],
                jobRuntimeRange: [100, 100],
                numJobsRange: [0, 0],
                jobCreateTimeRange: [1, 1],
                ioLengthRange: [3, 3]
            },

            {
                ioFrequencyRange: [1, 1],
                jobRuntimeRange: [100, 100],
                numJobsRange: [5, 5],
                jobCreateTimeRange: [10, 10],
                ioLengthRange: [3, 3]
            },
        ]
    },
    scheduler: {
        attributes: [
            "none",
            "none&priority=greyscale",
        ],
        options: {
            showBoostTimer: true
        }
    },
    splom: {
        attributes: [
            ".init.runTime",
            ".init.createTime",
            ".init.ioFreq"
        ]
    },
    parallel: {
        attributes: [
            ".init.runTime",
            ".init.createTime",
            ".init.ioFreq"
        ]
    },
    parameter: {
        "render": true,
        "Scheduler Parameters": {
            "Boost Time": 25,
            "Number of Queues": 8,
            "timeQuantums": [2, 1, 2, 1, 2, 1, 3, 2]
        },
        "Job Generator": {
        },
    },
    details: {
        lesson: [
            {
                message: "We have one last issue to deal with," +
                " starvation! How do we stop new jobs" +
                " from preventing older jobs from running?" +
                " The answer is to BOOST!",

                atCycle: 1
            },
            {
                message: "Lets decrease a job's priority first, this" +
                " will help us see the importance of the boost!",

                atCycle: 5
            },
            {
                message: "Lets add some interactive jobs, See how they gobble " +
                " up the cpu?",

                atCycle: 10
            },
            {
                message: "BOOST NOW!!! GO GO GO! ",

                atCycle: 25
            },

            {
                message: "See how the jobs all got reprioritized? thats how the MLFQ manages starvation!" +
                " CONGRATULATIONS!! you have completeted the MLFQ training program! check out the" +
                " lesson labeled EXPLORE to further explore the MLFQ!",

                atCycle: 28
            },
        ],
        attributes: [
            ".init.ioFreq",
            "timeQuantum",
            ".running.priority",
            ".running.avgPriority",
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