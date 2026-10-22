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
export declare function createJob(job: Job): Promise<void>;
export {};
//# sourceMappingURL=job.service.d.ts.map