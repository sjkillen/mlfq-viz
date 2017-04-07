export default {
   lessonName: "THE TIME QUANTUM",
   simulation: {
      timeQuantums: [3, 6, 9, 12, 15, 18, 21, 24],
      boostTime: Infinity,
      resetTQsOnIO: true,
      speed: 1000,
      generation: [
         {
            ioFrequencyRange: [200, 200],
            jobRuntimeRange: [50, 50],
            numJobsRange: [3, 3],
            jobCreateTimeRange: [1, 1],
            ioLengthRange: [100, 100]
         },
        {
            ioFrequencyRange: [5, 5],
            jobRuntimeRange: [10, 10],
            numJobsRange: [2, 2],
            jobCreateTimeRange: [15, 15],
            ioLengthRange: [2, 2]
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
         ".init.runTime",
         ".init.createTime",
         ".init.ioFreq"
      ]
   },
   parameter: {
       "render": true,
        "Scheduler Parameters": {
            "Number of Queues": 8,
            "timeQuantums": [3, 6, 9, 12, 15, 18, 21, 24],
        },
        "Job Generator": {
            "Number of Jobs": 5, 
            "Duration": 50,
        },
   },
   details: {
        lesson: [
         {
            message: "So how does the MLFQ tell how long a job should"+
                    " run on the cpu before rescheduling it? It does so"+
                    " by giving each queue a set time that its jobs should run"+
                    " on the cpu before decreasing the job's priority. This length"+
                    " of time is called the Time Quantum. Let's add"+
                    " some jobs and see it in action! (try changing what's encoded!"+
                    " click the drop down bar underneath the scheduler!)",

            atCycle: 1
         },
        {
            message: "sSe how the jobs take more time on the cpu the further it gets"+
                    " deprioritized? This lets longer jobs get"+
                    " deprioritized  while shorter (more interactive ones"+
                    " get run more frequently) .Let's add some interactive"+
                    " jobs and see what happens! \n "+
                    " Click on the scheduler parameters panel in the"+
                    " top left to see the time quantum for each que."+
                    " keep in mind that for lessons, this is read only.",


            atCycle: 15
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

