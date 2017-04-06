export default {
   lessonName: "JOB LIFE CYCLE",
   simulation: {
      timeQuantums: [5, 5, 5, 5, 5, 5],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [10, 10],
            jobRuntimeRange: [5, 5],
            numJobsRange: [5, 5],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [50, 100]
         },
         {
            ioFrequencyRange: [10, 10],
            jobRuntimeRange: [5, 5],
            numJobsRange: [5, 5],
            jobCreateTimeRange: [30, 30],
            ioLengthRange: [50, 100]
         },
      ]
   },
   scheduler: {
      attributes: [
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
        },
        "Job Generator": {
            "Number of Jobs": 10, 
            "Duration": 5,
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