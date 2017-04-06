export default {
   lessonName: "GETTING STARTED",
   simulation: {
      timeQuantums: [50, 5, 5, 5, 5, 5, 5, 5],
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
        },
        "Job Generator": {
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