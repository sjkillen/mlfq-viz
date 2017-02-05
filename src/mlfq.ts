/**
 * Schedule for running MLFQ simulations and genarating data
 */


interface Random {
   seed(seed: string): void;
   range(range: [number, number]): number;
}

class Job {
   // Values the job is created with
   init: {
      // Time when job was created
      readonly createTime: number;
      // Total time job needs to spend on CPU to finish
      readonly runTime: number;
      // How often (%) of runtime job will perform IO
      readonly ioFreq: number;
   };
   // values collected once turing the jobs lifetime
   perf: {
      // Time it took from when job was created to be scheduled
      responseTime: number;
      // total time from when job was created till it finished
      turnaroundTime: number;
   };
   // values that vary as the job runs
   running: {
      // Which queue job is in
      priority: number;
      // Time job has spent on the CPU
      serviceTime: number;
      // Value that starts = to time quantum and deplets as job is run
      // Forces a context switch and resets when it reaches 0
      quantumLeft: number;
      // Amount of ticks left to complete io, 0 if job isn't performing io
      ioLeft: number;
   };
   constructor({ createTime , runTime, ioFreq }: { createTime: number, runTime: number, ioFreq: number }) {
      this.init = {
         createTime,
         runTime,
         ioFreq
      };
      this.perf = {
         responseTime: -1,
         turnaroundTime: -1
      };
      this.running = {
         priority: -1,
         serviceTime: 0,
         quantumLeft: -1,
         ioLeft: -1
      };
   }
}

interface Configuration {
   timeQuantums: number[];
   boostTime: number;
   random: Random;
   ioFrequencyRange: [number, number];
   jobRuntimeRange: [number, number];
   numJobsRange: [number, number];
   jobCreateTimeRange: [number, number];
}


export default
class Scheduler {
   // How many priority levels
   readonly numQueues: number;
   // How often to boost job priorities
   readonly boostTime: number;

   readonly queues: { timeQuantum: number, jobs: Job[] }[];

   readonly random: Random;

   private config: Configuration;

   // jobs that have not yet entered a queue
   private futureJobs: Job[];

   /**
    * Create a scheduler with a queue for each given time quantum
    * and a global boost time
    */
   constructor(config: Configuration) {
      const { timeQuantums, boostTime, random } = config;
      this.numQueues = timeQuantums.length;
      this.boostTime = boostTime;
      this.config = config;
      this.random = random;
      this.queues = timeQuantums.map(q => ({ timeQuantum: q, jobs: [] }));
   }

   /**
    * Generate jobs based on the scheduler's config
    */
    generateJobs() {
       this.futureJobs = [];
       const {
          numJobsRange,
          jobCreateTimeRange,
          ioFrequencyRange,
          jobRuntimeRange
       } = this.config;
       const ran = this.random.range.bind(this.random);
       const numJobs = ran(numJobsRange);
       for (let i = 0; i < numJobs; i++) {
          this.futureJobs.push(new Job({
            createTime: ran(jobCreateTimeRange),
            runTime: ran(jobRuntimeRange),
            ioFreq: ran(ioFrequencyRange)
          }));
       }
    }

}