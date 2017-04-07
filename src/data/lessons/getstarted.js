export default {
   lessonName: "GETTING STARTED",
   simulation: {
      timeQuantums: [3, 4, 5, 6, 9, 10, 12, 13],
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
        },
   },
   details: {
             
        lesson: [
         {
            message: "Welcome to the MLFQ scheduling simulator, " +
                    "thanks for taking an interest in computer systems! " +
                    "Let's start with the basics! When a job is created," +
                    "it is scheduled and placed into the first queue." +
                    "Let's' create some jobs now!",

            atCycle: 1
         },
         {
            message: "Next, jobs proceed to the CPU where they are run " +
                    "for a little while then either enter IO, gets re-scheduled, " +
                    "or exits the MLFQ. Let's let it run for a bit and get an " +
                    "overview of the whole system, if you don't understand " +
                    "everything yet, don't worry this is just an overview lesson!",

            atCycle: 5
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