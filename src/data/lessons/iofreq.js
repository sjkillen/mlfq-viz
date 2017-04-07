export default {
   lessonName: "IO FREQUENCY AND PRIORITY",
   simulation: {
      timeQuantums: [2, 3, 4, 5, 8, 10, 11, 12],
      boostTime: Infinity,
      resetTQsOnIO: true,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [2, 2],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
        {
            ioFrequencyRange: [3, 3],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
        {
            ioFrequencyRange: [4, 4],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
        {
            ioFrequencyRange: [5, 5],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3]
         },
         //starvation job
        {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [40, 40],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [40, 40],
            ioLengthRange: [1, 1]
         },
      ]
   },
   scheduler: {
      attributes: [
        ".init.ioFreq",
      ],
      options: {
         showBoostTimer: false
      }
   },
   splom: {
      attributes: [
        ".init.ioFreq",
        ".running.avgPriority",
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
        lesson: [
         {
            message: "Interactive jobs have a high frequency of IO,"+
                    " this means that they often receive input from"+ 
                    " the user. Let's watch how high frequency jobs"+ 
                    " get prioritized! (feel free to play with the speed!)",




            atCycle: 1
         },
        {
            message: "See how the high frequency jobs get run more often?"+
                    " That's because they get set back to the queue that"+
                    " they came from when they leave IO. This lets"+
                    " them get a higher priority! Click the left"+
                    " arrow to see a scatterplot, the higher the"+
                    " IO frequency, the higher priority!"+ 
                    " Can you think of any problems? Let's add"+
                    " a really interactive jobs.",





            atCycle: 30
        },
        {
            message: "See how the new job takes up all the cpu time? Although"+
                    " the scheduler lets highly interactive"+
                    " jobs run, it neglects longer running jobs"+
                    " this phenomenon is called Starvation."+
                    " Furthermore, a clever user may try to game"+
                    " the scheduler by organizing his program to run"+
                    " lots of IO.",






            atCycle: 45
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