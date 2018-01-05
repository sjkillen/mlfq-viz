export default {
   lessonName: "EXPLORE",
   simulation: {
      timeQuantums: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 10,
      generation: [
         {
            ioFrequencyRange: [100, 200],
            jobRuntimeRange: [Infinity, Infinity],
            numJobsRange: [10, 10],
            jobCreateTimeRange: [1, 1000],
            ioLengthRange: [100, 500],
         },
      ],
   },
   scheduler: {
      attributes: [
         "none",
         ".init.ioFreq",
         ".init.ioLength",
         "tq",
         "none&priority=greyscale",
         "tq&priority=greyscale",
      ],
      options: {
         showBoostTimer: true,
      },
   },
   splom: {
      attributes: [/*
            [".init.ioFreq", ".perf.responseTime"],
            [".perf.responseTime", ".init.ioFreq"]*/
      ],
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
      "Scheduler Parameters": {
         "Boost Time": 100,
         "Number of Queues": 12,
         "timeQuantums": [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      },
      "Job Generator": {
         "Duration": 10,
         "Number of Jobs": 10,
         "IO Frequency Min": 10,
         "IO Frequency Max": 20,
         "IO Length Min": 10,
         "IO Length Max": 15,
      },
   },
   details: {
      lesson: [
         {
            message: "Welcome to Explore mode!",
            atCycle: 1,
            dontPause: true,
         },
         {
            message: "Your an MLFQ Warrior!",
            atCycle: 100,
            dontPause: true,
         },
         {
            message: "Fantastic Work! Keep Exploring!",
            atCycle: 200,
            dontPause: true,
         },
         {
            message: "I'm glad your enjoying the visualization",
            atCycle: 300,
            dontPause: true,
         },
         {
            message: "Wow! This is quite a lengthy simulation",
            atCycle: 400,
            dontPause: true,
         },
         {
            message: "Sorry, this is all we got for messages in explore mode",
            atCycle: 500,
            dontPause: true,
         },
      ],
      attributes: [
         ".init.ioFreq",
         ".init.runTime",
         "timeQuantum",
         ".perf.turnaroundTime",
         ".running.priority",
         ".running.serviceTime",
         ".running.avgPriority",
         ".perf.responseTime",
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
