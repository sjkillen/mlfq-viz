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
         showBoostTimer: false
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
            message: "Sometimes a job needs to perform IO. When IO occurs while a job is running on the CPU, the job is placed in the box labeled IO. When the job finishes IO, it returns to the queues and waits to be scheduled. IO Frequency varies between jobs, jobs with a high IO frequency are considered interactive and need to be run on the CPU often, but not as long as CPU bound jobs",
            atCycle: 1
         }
        ],
      attributes: [
         ".init.ioFreq",
         ".init.ioLength",
      ]
   },
   navigation: [
      "scheduler",
      "parameter",
      "details",
      "splom",
      "parallel"
   ]
}