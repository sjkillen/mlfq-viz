export default {
   lessonName: "JOB LIFE CYCLE",
   simulation: {
      timeQuantums: [3, 3, 5, 5, 5, 5, 5, 5],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [10, 10],
            jobRuntimeRange: [3, 3],
            numJobsRange: [2, 2],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [50, 100]
         },
        {
            ioFrequencyRange: [16, 16],
            jobRuntimeRange: [6, 6],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [10, 10],
            ioLengthRange: [50, 100]
         },
        {
            ioFrequencyRange: [10, 10],
            jobRuntimeRange: [3, 3],
            numJobsRange: [2, 2],
            jobCreateTimeRange: [11, 11],
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
      ]
   },
   parallel: {
      attributes: [
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