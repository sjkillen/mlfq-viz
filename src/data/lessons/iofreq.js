export default {
   lessonName: "IO FREQUENCY AND PRIORITY",
   simulation: {
      timeQuantums: [5, 5, 5, 5, 5, 5,],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 5],
            jobRuntimeRange: [10, 10],
            numJobsRange: [3, 3],
            jobCreateTimeRange: [1, 5],
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
            "Boost Time": 50,
            "Number of Queues": 8,
            "timeQuantums": [50, 5, 5, 5, 5, 5, 5, 5],
        },
        "Job Generator": {
            "Number of Jobs": 10, 
            "IO Frequency Min" : 10,
            'IO Frequency Max' : 20,
            "Duration": 10,
            "IO Length Min" : 10,
            "IO Length Max" : 15,
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