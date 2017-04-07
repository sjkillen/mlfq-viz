export default {
   lessonName: "THE TIME QUANTUM",
   simulation: {
      timeQuantums: [3, 6, 9, 12, 15, 18, 21, 24],
      boostTime: Infinity,
      resetTQsOnIO: true,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [200, 200],
            jobRuntimeRange: [50, 50],
            numJobsRange: [3, 3],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [100, 100]
         },
        {
            ioFrequencyRange: [5, 5],
            jobRuntimeRange: [10, 10],
            numJobsRange: [2, 2],
            jobCreateTimeRange: [20, 20],
            ioLengthRange: [2, 2]
         },
         
      ]
   },
   scheduler: {
      attributes: [
         "tq",
         "tq&priority=greyscale",
         "tq&priority=rainbow"
      ],
      options: {
         showBoostTimer: true
      }
   },
   splom: {
      attributes: [
          
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
            "timeQuantums": [2, 3, 4, 5, 8, 10],
        },
        "Job Generator": {
            "Number of Jobs": 5, 
            "Duration": 50,
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