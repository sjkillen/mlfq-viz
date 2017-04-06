export default {
   lessonName: "IO FREQUENCY AND PRIORITY",
   simulation: {
      timeQuantums: [4, 5, 6, 7, 8, 10],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 10],
            jobRuntimeRange: [50, 50],
            numJobsRange: [5, 5],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
      ]
   },
   scheduler: {
      attributes: [
         ".init.ioFreq",
         ".init.ioLength",
         "tq",
         "none"
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
            "Number of Queues": 6,
            "timeQuantums": [4, 5, 6, 7, 8, 10],
        },
        "Job Generator": {
            "Number of Jobs": 5,
            "IO Frequency Min" : 1,
            'IO Frequency Max' : 20,
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