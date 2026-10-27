interface Job {
    jobId: string;
    status: string;
    failedAt?: number;
    clips: {
        part: number;
        status: string;
        videoId: string | null;
    }[];
}
export declare function updateJobStatus(jobId: string, status: string): Promise<void>;
export declare function updateClipStatus(jobId: string, part: number, status: string, videoId: string): Promise<void>;
export declare function createJob(job: Job): Promise<void>;
export declare function getJobById(jobId: string): Promise<Job | undefined>;
export {};
//# sourceMappingURL=job.service.d.ts.map