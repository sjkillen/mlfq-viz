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
            ioLengthRange: [3, 3],
         },
         {
            ioFrequencyRange: [3, 3],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3],
         },
         {
            ioFrequencyRange: [4, 4],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3],
         },
         {
            ioFrequencyRange: [5, 5],
            jobRuntimeRange: [50, 50],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [3, 3],
         },
         //starvation job
         {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [40, 40],
            numJobsRange: [0, 0],
            jobCreateTimeRange: [40, 40],
            ioLengthRange: [1, 1],
            flags: ["evil"],
         },
      ],
   },
   scheduler: {
      attributes: [
         ".init.ioFreq",
      ],
      options: {
         showBoostTimer: false,
      },
   },
   splom: {
      attributes: [],
   },
   parallel: {
      attributes: [
         ".init.runTime",
         ".init.createTime",
         ".init.ioFreq",
      ],
   },
   parameter: {
      "render": true,
      "Scheduler Parameters": {},
      "Job Generator": {},
   },
   details: {
      lesson: [
         {
            message: "Interactive jobs have a high frequency of IO. Let's watch" +
               " how priority is affected by IO Frequency! (feel free to play with the speed!)",
            atCycle: 1,
         },
         {
            message: "Notice that the high frequency jobs get run more often?" +
               " That's because perform IO before their time quantum expires. This let's" +
               " them get a higher priority. Click the left" +
               " arrow to see a scatterplot, the higher the" +
               " IO frequency, the higher priority." +
               " Can you think of any problems with this Time Quantum system? Let's add a malicious job.",
            atCycle: 30,
         },
         {
            message: "See how the new job takes up all the cpu time? Although" +
               " the scheduler lets highly interactive" +
               " jobs run, it neglects longer running jobs" +
               " this phenomenon is called Starvation." +
               " Furthermore,  try to game" +
               " the scheduler by organizing his program to run" +
               " lots of IO.",
            atCycle: 45,
         },
      ],
      attributes: [
         ".init.ioFreq",
         ".init.ioLength",
      ],
   },
   navigation: [
      "scheduler",
      "parameter",
      "details",
      "splom",
      "parallel",
   ],
};
