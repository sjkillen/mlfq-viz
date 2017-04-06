export default {
   lessonName: "GETTING STARTED",
   simulation: {
      timeQuantums: [3, 4, 5, 6, 9, 10],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [10, 20],
            jobRuntimeRange: [100, 200],
            numJobsRange: [3, 3],
            jobCreateTimeRange: [1, 5],
            ioLengthRange: [10, 20]
         },
         {
            ioFrequencyRange: [10, 20],
            jobRuntimeRange: [100, 200],
            numJobsRange: [2, 2],
            jobCreateTimeRange: [30, 40],
            ioLengthRange: [10, 20]
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