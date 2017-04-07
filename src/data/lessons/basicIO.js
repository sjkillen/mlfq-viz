export default {
   lessonName: "BASIC IO",
   simulation: {
      timeQuantums: [5, 5, 5, 5, 5, 5, 5, 5],
      boostTime: Infinity,
      resetTQsOnIO: true,
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
            "Number of Jobs": 6, 
            "Duration": 5,
            "IO Length Min" : 3,
            "IO Length Max" : 3,
        },
   },
   details: {
        lesson: [
         {
            message: "Sometimes a job needs to perform IO, this means that"+
                    " it is receiving some input from another program."+
                    " When IO happens, the job is placed in the IO box,"+
                    " when it is finished it gets placed right back in the que where it"+
                    " came from. This is to prevent interactive jobs being pushed back "+
                    " to lower priority, and helps maintain a interactive system.",



            atCycle: 1
         }
        ],
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