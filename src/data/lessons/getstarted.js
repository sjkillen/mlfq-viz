export default {
   lessonName: "GETTING STARTED",
   simulation: {
      timeQuantums: [2, 3, 4, 4, 4, 4, 5, 6],
      boostTime: Infinity,
      resetTQsOnIO: false,
      speed: 3000,
      generation: [
         {
            ioFrequencyRange: [10, 20],
            jobRuntimeRange: [100, 200],
            numJobsRange: [2, 4],
            jobCreateTimeRange: [1, 10],
            ioLengthRange: [10, 20],
         },
         {
            ioFrequencyRange: [10, 20],
            jobRuntimeRange: [100, 200],
            numJobsRange: [2, 4],
            jobCreateTimeRange: [30, 40],
            ioLengthRange: [10, 20],
         },
         {
            ioFrequencyRange: [10, 20],
            jobRuntimeRange: [100, 200],
            numJobsRange: [2, 4],
            jobCreateTimeRange: [60, 70],
            ioLengthRange: [10, 20],
         },
         {
            ioFrequencyRange: [10, 20],
            jobRuntimeRange: [100, 200],
            numJobsRange: [2, 4],
            jobCreateTimeRange: [90, 120],
            ioLengthRange: [10, 20],
         },
      ],
   },
   scheduler: {
      attributes: [
         "none",
      ],
      options: {
         showBoostTimer: false,
      },
   },
   splom: {
      attributes: [],
   },
   parallel: {
      attributes: [],
   },
   parameter: {
      "render": true,
      "Scheduler Parameters": {},
      "Job Generator": {},
   },
   details: {
      lesson: [
         {
            message: "Welcome to the MLFQ Operating System Scheduler Visualization! Wow, what a mouthful, " +
               "what is MLFQ anyway? In these short lessons we'll guide you through the basics of the algorithm. " +
               "Begin a simulation by pressing the Play button. CPU jobs are represented by white hollow circles.",
            atCycle: 1,
         },
         {
            message: "When jobs enter the simulation, they are assigned the highest priority (priority 0). " +
               "Job's are placed in queues, delineated by the numbered rectangles above, according to their " +
               "priority. Jobs remain in their queue while they are waiting to be scheduled and " +
               "run on the CPU. When a job is scheduled, the circle moves from it's queue to the CPU." +
               " With each cycle that the simulation runs, the timer next to the CPU will increment",
            atCycle: 5,
         },
      ],
      attributes: [],
   },
   navigation: [
      "scheduler",
      "parameter",
      "details",
      "splom",
      "parallel",
   ],
};
