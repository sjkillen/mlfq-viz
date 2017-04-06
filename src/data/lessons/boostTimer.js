export default {
   lessonName: "THE BOOST TIMER",
   simulation: {
      timeQuantums: [3, 4, 5, 6, 7, 8, 10, 12],
      boostTime: 20,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 10],
            jobRuntimeRange: [100, 100],
            numJobsRange: [6, 6],
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
            "Boost Time": 25,
            "Number of Queues": 8,
            "timeQuantums": [3, 4, 5, 6, 7, 8, 10, 12]
        },
        "Job Generator": {
            "Number of Jobs": 5, 
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