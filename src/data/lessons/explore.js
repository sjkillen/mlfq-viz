export default {
   lessonName: "EXPLORE",
   simulation: {
      timeQuantums: [5, 5, 5, 5, 5, 5, 5, 5],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [100, 200],
            numJobsRange: [1, 1],
            jobCreateTimeRange: [5, 5],
            ioLengthRange: [50, 100],
            flags: ["evil"]
         },
         {
            ioFrequencyRange: [30, 40],
            jobRuntimeRange: [60, 1000],
            numJobsRange: [5, 5],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [1, 49]
         }
      ]
   },
   scheduler: {
      attributes: [
         "none",
         ".init.ioFreq",
         ".init.ioLength",
         "tq",
         "none&priority=greyscale",
         "tq&priority=greyscale",
         "none&priority=rainbow",
         "tq&priority=rainbow"
      ],
      options: {
         showBoostTimer: true
      }
   },
   splom: {
      attributes: [
         ".init.ioFreq",
         ".perf.responseTime",
         ".perf.turnaroundTime",
         ".running.avgPriority",
         ".init.runTime",
         ".init.createTime",
         ".init.ioLength",
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
         "Boost Time": 100,
         "Scheduler Height": 30,
         "Number of Queues": 8,
         "timeQuantums": [50, 5, 5, 5, 5, 5, 5, 5],

      },
      "Job Generator": {
         "Duration": 10,
         "Number of Jobs": 10,
         "IO Frequency Min": 10,
         'IO Frequency Max': 20,
         "IO Length Min": 10,
         "IO Length Max": 15,
      },
   },
   details: {
      lesson: [
         {
            message: "Welcome",
            atCycle: 1
         },
         {
            message: "This is cycle 5",
            atCycle: 5
         }
      ],
      attributes: [
         ".init.ioFreq",
         ".init.runTime",
         ".init.createTime",
         "timeQuantum",
         ".perf.turnaroundTime",
         ".running.serviceTime",
         ".running.priority",
         ".running.serviceTime",
         ".running.totalWaitingTime",
         ".running.avgPriority",
         ".perf.responseTime"
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