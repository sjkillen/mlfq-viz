/**
 * Schedule for running MLFQ simulations and genarating data
 */

/**
 * Interface for an injectable library for generating random numbers using a seed
 */
interface Random {
   /**
    * Set the seed
    */
   seed(seed: string): void;
   /**
    * Return a random int between a range
    */
   range(range: [number, number]): number;
}


/**
 * Config to create a job
 */
interface JobConfig {
   createTime: number;
   runTime: number;
   ioFreq: number;
   ioLength: number;
}

/**
 * A single job in the simulation
 */
class Job {
   // Values the job is created with
   init: {
      // Time when job was created
      createTime: number;
      // Total time job needs to spend on CPU to finish
      runTime: number;
      // How often (%) of runtime job will perform IO
      ioFreq: number;
      // How long this job performs IO for
      ioLength: number;
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
   /**
    * Lowers the job's priority and reset its time quantum
    * @param priority to set as
    * @param quantum to use
    */
   lowerPriority(priority: number, quantum: number) {
      this.running.quantumLeft = quantum;
      this.running.priority = priority;
   }
   /**
    * Boost the job's priority and reset its time quantum
    * @param quantum to use
    */
   setQuantum(quantum: number) {
      this.running.quantumLeft = quantum;
      this.running.priority = 0;
   }
   /**
    * Simulate this job on the CPU
    * May start IO
    * @param globalTick number of ticks since the simulation started
    * @param rand random library to use for IO
    */
   doWork(globalTick: number, rand: Random) {
      if (this.perf.responseTime === -1)
         this.perf.responseTime = globalTick - this.init.createTime;
      this.running.serviceTime++;
      this.running.quantumLeft--;
      if (this.running.serviceTime < 0 ||
         this.running.quantumLeft < 0 ||
         this.running.ioLeft > 0) {
         throw new Error("Job was not meant to be run");
      }
      if (this.running.serviceTime === this.init.createTime) {
         this.perf.turnaroundTime = globalTick - this.init.createTime;
      } else if (!this.quantumExpired()) {
         this.maybeStartIO(rand);
      }
   }
   /**
    * Return whether jobs time quantum has run out
    */
   quantumExpired() {
      return this.running.quantumLeft === 0;
   }

   /**
    * Check if the job is finished
    */
   isFinished(): boolean {
      return this.perf.turnaroundTime !== -1;
   }
   /**
    * Simulate this job doing IO
    * @throws if job has no IO left
    */
   doIO() {
      if (!this.doingIO())
         throw new Error("job not doing IO");
      this.running.ioLeft--;
   }
   /**
    * Checks if job should start now, throws if it missed its start
    * @param globalTick number of ticks since the simulation started
    */
   shouldStart(globalTick: number): boolean {
      if (this.init.createTime === globalTick) {
         return true;
      }
      if (this.init.createTime < globalTick) {
            debugger;
         throw new Error("Job missed start");
      }
      return false;
   }
   /**
    * Sometimes starts performing IO (uses IO freq)
    * @param rand random library to use
    */
   private maybeStartIO(rand: Random) {
      if (rand.range([0, 100]) <= this.init.ioFreq) {
         this.running.ioLeft = this.init.ioLength;
      }
   }
   /**
    * Returns whether job is performing IO
    */
   doingIO(): boolean {
      return this.running.ioLeft > 0;
   }
   constructor({ createTime, runTime, ioFreq, ioLength }: JobConfig) {
      this.init = {
         createTime,
         runTime,
         ioFreq,
         ioLength
      };
      this.perf = {
         responseTime: -1,
         turnaroundTime: -1
      };
      this.running = {
         priority: 0,
         serviceTime: 0,
         quantumLeft: -1,
         ioLeft: -1
      };
   }
}

/**
 * Config for Scheduler
 */
interface Configuration {
   timeQuantums: number[];
   boostTime: number;
   random: Random;
   ioFrequencyRange: [number, number];
   ioLengthRange: [number, number];
   jobRuntimeRange: [number, number];
   numJobsRange: [number, number];
   jobCreateTimeRange: [number, number];
}


class Queue {
   timeQuantum: number;
   jobs: Job[];
}

/**
 * MLFQ Simulator
 */
export default
   class Scheduler {
   // How many priority levels
   numQueues: number;
   // How often to boost job priorities
   boostTime: number;
   boostLeft: number;

   queues: Queue[];
   cpuJob: Job | undefined;

   random: Random;

   private config: Configuration;

   // jobs that have not yet entered a queue
   private futureJobs: Job[];

   // jobs that have been completed
   private finishedJobs: Job[];

   // jobs doing io
   private ioJobs: Job[];

   // How often, in real ms, to tick the scheduler
   private speed: number;
   public running: boolean;
   private tickIntervalId: number;

   // How many ticks the scheduler has performed
   public globalTick: number;

   /**
    * Create a scheduler with a queue for each given time quantum
    * and a global boost time
    */
   constructor(config: Configuration) {
      this.finishedJobs = [];
      this.ioJobs = [];
      this.numQueues = config.timeQuantums.length;
      this.queues = config.timeQuantums.map(q => ({ timeQuantum: q, jobs: [] }));
      this.configure(config);
      this.globalTick = 0;
   }

   /**
    * Runs the scheduler
    */
   play(speed: number, update: { (data: Scheduler): void }) {
      if (this.running)
         throw new Error("Scheduler already running!");
      const tick = () => {
         this.tickIntervalId = setTimeout(tick, speed);
         this.processJobs();
         update(this);
      };
      this.tickIntervalId = setTimeout(tick, speed);
   }

   /**
    * Returns whether simulation is finished
    */
   simulationFinished(): boolean {
      if (this.futureJobs.length || this.ioJobs.length || this.cpuJob)
         return false;
      for (const queue of this.queues) {
         if (queue.jobs.length)
            return false;
      }
      console.log("MLFQ Simulation completed");
      return true;
   }

   /**
    * Boost all jobs
    */
   boostJobs() {
      this.queues[0].jobs = Array.prototype.concat(
         ...this.queues.map(q => q.jobs)
      );
      for (let i = 1; i < this.queues.length; i++) {
         this.queues[i].jobs = [];
      }
      for (const job of this.queues[0].jobs) {
         job.setQuantum(this.queues[0].timeQuantum);
      }
   }
   /**
    * Configure the schedule
    */
   configure(config: Configuration) {
      const { timeQuantums, boostTime, random } = config;
      this.config = config;
      this.random = random;
      this.boostTime = boostTime;
      this.boostLeft = boostTime;
      // reset the queues if numbers changed
      if (this.numQueues !== config.timeQuantums.length) {
         this.boostJobs();
         const firstQueue = this.queues[0].jobs;
         this.queues = config.timeQuantums.map(q => ({ timeQuantum: q, jobs: [] }));
         this.queues[0].jobs = firstQueue;
      }
      this.numQueues = timeQuantums.length;
   }

   /**
    * Put jobs that have finished IO back in their queues
    */
   finishIO() {
      for (let i = 0; i < this.ioJobs.length; i++) {
         const job = this.ioJobs[i];
         if (!job.doingIO()) {
            this.ioJobs.splice(i, 1);
            this.queues[job.running.priority].jobs.push(job);
         }
      }
   }

   /**
    * performs IO for all IO jobs
    */
   doIO() {
      for (const job of this.ioJobs) {
         job.doIO();
      }
   }

   /**
    * Stop the scheduler
    */
   stop() {
      this.running = false;
      clearTimeout(this.tickIntervalId);
      this.tickIntervalId = -1;
   }

   /**
    * Add futureJobs to queue 1
    * @param globalTick scheduler tick
    */
   startJobs(globalTick: number) {
         console.log(globalTick)
      for (let i = 0; i < this.futureJobs.length; i++) {
         const job = this.futureJobs[i];
         if (job.shouldStart(globalTick)) {
            this.futureJobs.splice(i, 1);
            job.setQuantum(this.queues[0].timeQuantum);
            this.queues[0].jobs.push(job);            
            (job as any).iTried = false;
         } else {
               //TODO remove
               (job as any).iTried = globalTick;
         }
      }
   }

   /**
    * Process the jobs in the scheduler
    */
   processJobs() {
      if (!this.simulationFinished()) {
         this.boostLeft--;
         if (this.boostLeft <= 0) {
            this.boostJobs();
            this.boostLeft = this.boostTime;
         }
         this.doIO();
         this.finishIO();
         this.startJobs(this.globalTick);
         this.processCpuJob();
         this.globalTick++;
      } else {
         this.stop();
      }
   }

   /**
    * Process a single job on the cpu
    */
   processCpuJob() {
      let chosen: Job | undefined;
      if (this.cpuJob)
         chosen = this.cpuJob;
      else
         chosen = this.popNextJob();
      if (chosen) {
         chosen.doWork(this.globalTick, this.random);
         if (chosen.isFinished()) {
            this.finishedJobs.push(chosen);
            this.cpuJob = undefined;
         }
         else if (chosen.quantumExpired()) {
            const lastQueue = this.numQueues - 1;
            const lowerPriority = chosen.running.priority === (lastQueue) ? lastQueue : chosen.running.priority + 1;
            chosen.lowerPriority(lowerPriority, this.queues[lowerPriority].timeQuantum);
            this.queues[chosen.running.priority].jobs.push(chosen);
            this.cpuJob = undefined;
         }
         else if (chosen.doingIO()) {
            this.ioJobs.push(chosen);
            this.cpuJob = undefined;
         } else {
               this.cpuJob = chosen;
         }
      } else {
         // IDLE
      }
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
         ioLengthRange,
         jobRuntimeRange
      } = this.config;
      const ran = this.random.range.bind(this.random);
      const numJobs = ran(numJobsRange);
      for (let i = 0; i < numJobs; i++) {
         this.futureJobs.push(new Job({
            createTime: ran(jobCreateTimeRange),
            runTime: ran(jobRuntimeRange),
            ioFreq: ran(ioFrequencyRange),
            ioLength: ran(ioLengthRange),
         }));
      }
   }

   /**
    * Removes the job the should be run next from it's queue
    * return undefined if theyre no jobs to run
    */
   private popNextJob(): Job | undefined {
      for (const queue of this.queues) {
         if (queue.jobs.length > 0) {
            return queue.jobs.shift();
         }
      }
   }
}