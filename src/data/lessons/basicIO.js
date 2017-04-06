export default {
   lessonName: "BASIC IO",
   simulation: {
      timeQuantums: [5, 5, 5, 5, 5, 5, 5, 5],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 5],
            jobRuntimeRange: [5, 5],
            numJobsRange: [3, 3],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
         {
            ioFrequencyRange: [1, 5],
            jobRuntimeRange: [5, 5],
            numJobsRange: [3, 3],
            jobCreateTimeRange: [10, 10],
            ioLengthRange: [3, 3]
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
            "Duration": 10,
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