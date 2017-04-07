export default {
   lessonName: "EXPLORE",
   simulation: {
      timeQuantums: [5, 5, 5, 5, 5, 5, 5, 5],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [1, 1],
            jobRuntimeRange: [100, 200],
            numJobsRange: [1, 1],
            jobCreateTimeRange: [5, 5],
            ioLengthRange: [50, 100]
         },
         {
            ioFrequencyRange: [30, 40],
            jobRuntimeRange: [60, 1000],
            numJobsRange: [5, 5],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [1, 49]
         }
      ]
   },
   scheduler: {
      attributes: [
         "none",
         ".init.ioFreq",
         ".init.ioLength",
         "tq",
         "none&priority=greyscale",
         "tq&priority=greyscale",
         "none&priority=rainbow",
         "tq&priority=rainbow"
      ],
      options: {
         showBoostTimer: true
      }
   },
   splom: {
      attributes: [
         ".init.ioFreq",
         ".perf.responseTime",
         ".perf.turnaroundTime",
         ".running.avgPriority",
         ".init.runTime",
         ".init.createTime",
         ".init.ioLength",
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
<<<<<<< HEAD
      "render": true,
      "Scheduler Parameters": {
         "Boost Time": 100,
         "Scheduler Height": 30,
         "Number of Queues": 8,
         "timeQuantums": [50, 5, 5, 5, 5, 5, 5, 5],

      },
      "Job Generator": {
         "Duration": 10,
         "Number of Jobs": 10,
         "IO Frequency Min": 10,
         'IO Frequency Max': 20,
         "IO Length Min": 10,
         "IO Length Max": 15,
      },
=======
        "render": true,
        "Scheduler Parameters": {
            "Boost Time": 100,
            "Scheduler Height": 30,
            "Number of Queues": 12,
            "timeQuantums": [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            
        },
        "Job Generator": {
            "Duration": 10,
            "Number of Jobs": 10, 
            "IO Frequency Min" : 10,
            'IO Frequency Max' : 20,
            "IO Length Min" : 10,
            "IO Length Max" : 15,
        },
>>>>>>> 71a26cf061cb3f4d916e8839987cb2c518f727cc
   },
   details: {
      lesson: [
         {
            message: "Welcome to Explore mode! You are free here to play around with any MLFQ configuration you wish. The Job Generation panel is available in the parameter panel in the top right. Have fun!",
            atCycle: 1,
            dontPause: true
         },
         {
            message: "Your an MLFQ Warrior!",
            atCycle: 100,
            dontPause: true
         },
         {
            message: "Fantastic Work! Keep Exploring!",
            atCycle: 200,
            dontPause: true
         },
         {
            message: "I'm glad your enjoying the visualization",
            atCycle: 300,
            dontPause: true
         },
         {
            message: "Wow! This is quite a lengthy simulation",
            atCycle: 400,
            dontPause: true
         },
         {
            message: "Sorry, this is all we got for messages in explore mode",
            atCycle: 500,
            dontPause: true
         }
      ],
      attributes: [
         ".init.ioFreq",
         ".init.runTime",
         ".init.createTime",
         "timeQuantum",
         ".perf.turnaroundTime",
         ".running.serviceTime",
         ".running.priority",
         ".running.serviceTime",
         ".running.totalWaitingTime",
         ".running.avgPriority",
         ".perf.responseTime",
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