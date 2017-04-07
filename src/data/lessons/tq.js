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
            message: "So how does the MLFQ determine how long a job should run on the cpu before kicking it off? Each queue is given a fixed time length in cycles that jobs moving from the queue to the CPU should be able to run on CPU uninterupted. If a job exceeds it's Time Quantum (the job doesn't perform IO) the job is deprioritized and placed back in a lower queue. Let's add some jobs and see it in action! Try changing what's encoded inside the jobs by clicking the drop down bar underneath the scheduler",
            atCycle: 1
         },
        {
            message: "Notice how Time Quantums are greater for lower priority jobs? This causes the MLFQ to balance itself out, giving priority to more interactive jobs and allowing CPU-bound jobs to run on the CPU longer. Let's add some interactive jobs and see what happens!\nClick on the scheduler parameters panel in the top right to see the time quantum for each queue. keep in mind that for lessons, this is read only.",
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

