export default {
   lessonName: "IO FREQUENCY AND PRIORITY",
   simulation: {
      timeQuantums: [2, 3, 4, 5, 8, 10, 11, 12],
      boostTime: Infinity,
      resetTQsOnIO: true,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
        {
            ioFrequencyRange: [2, 2],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
        {
            ioFrequencyRange: [3, 3],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
        {
            ioFrequencyRange: [4, 4],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
         //starvation job
        {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [40, 40],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [40, 40],
            ioLengthRange: [1, 1]
         },
      ]
   },
   scheduler: {
      attributes: [
        ".init.ioFreq",
      ],
      options: {
         showBoostTimer: true
      }
   },
   splom: {
      attributes: [
        ".init.ioFreq",
        ".running.avgPriority",
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
            "Number of Queues": 8,
            "timeQuantums": [4, 5, 6, 7, 8, 10, 11, 12],
        },
        "Job Generator": {
            "Number of Jobs": 5,
            "IO Frequency Min" : 1,
            'IO Frequency Max' : 5,
            "Duration": 50,
            "IO Length Min" : 3,
            "IO Length Max" : 3,
        },
   },
   details: {
      attributes: []
   },
   navigation: [
      "scheduler",
      "parameter",
      "details",
      "splom",
      "parallel"
   ]
}