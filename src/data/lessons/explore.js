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