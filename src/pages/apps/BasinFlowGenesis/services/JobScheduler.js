import { v4 as uuidv4 } from 'uuid';

/**
 * JobScheduler
 * Manages background tasks and simulation queues.
 */
class JobSchedulerService {
    constructor() {
        this.queue = [];
        this.activeJobs = new Map();
        this.maxConcurrent = 2;
        this.processing = false;
        this.listeners = new Set();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(cb => cb(Array.from(this.activeJobs.values())));
    }

    async addJob(type, payload, processorFn) {
        const id = uuidv4();
        const job = {
            id,
            type,
            status: 'pending',
            progress: 0,
            payload,
            created_at: new Date(),
            processor: processorFn
        };
        
        this.activeJobs.set(id, job);
        this.queue.push(id);
        this.notify();
        this.processQueue();
        return id;
    }

    async processQueue() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const runningCount = Array.from(this.activeJobs.values()).filter(j => j.status === 'running').length;
            if (runningCount >= this.maxConcurrent) break;

            const jobId = this.queue.shift();
            const job = this.activeJobs.get(jobId);
            
            if (job) {
                this.runJob(job);
            }
        }

        this.processing = false;
    }

    async runJob(job) {
        job.status = 'running';
        job.started_at = new Date();
        this.notify();

        try {
            const updateProgress = (p) => {
                job.progress = p;
                this.notify();
            };

            const result = await job.processor(job.payload, updateProgress);
            
            job.status = 'completed';
            job.result = result;
            job.completed_at = new Date();
            job.progress = 100;
        } catch (error) {
            console.error(`Job ${job.id} failed:`, error);
            job.status = 'failed';
            job.error = error.message;
        }

        this.notify();
        // Trigger next
        this.processQueue();
    }

    getJob(id) {
        return this.activeJobs.get(id);
    }

    getAllJobs() {
        return Array.from(this.activeJobs.values());
    }
}

export const JobScheduler = new JobSchedulerService();