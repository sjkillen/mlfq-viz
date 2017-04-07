export default {
   lessonName: "PERSISTENT TIME QUANTUMS",
   simulation: {
      timeQuantums: [5, 7, 9, 11, 15, 20, 22, 28],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 3],
            jobRuntimeRange: [100, 100],
            numJobsRange: [5, 5],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
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
            "Number of Queues": 8,
            "timeQuantums": [5, 7, 9, 11, 15, 20, 22, 28],
        },
        "Job Generator": {

        },
   },
   details: {
        lesson: [
         {
            message: "The best way to prevent a job from"+
                    " stealing all of the CPU's time, and from"+ 
                    " a malicious user potentially gaming the"+ 
                    " scheduler, is to keep track of how long"+
                    " each job has run on the cpu - keeping"+ 
                    " track of the time quantum.",



            atCycle: 1
         },
         {
            message: "See how when jobs get scheduled "+
                    " to perform IO they keep track of their time quantum."+
                    " This will prevent IO heavy jobs from"+
                    " stealing all the cpu's resources.",



            atCycle: 12
         },

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