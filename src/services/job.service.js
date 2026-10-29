import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const jobFilePath = path.resolve("tmp/jobs.json");
export async function updateJobStatus(jobId, status) {
    await mkdir(path.dirname(jobFilePath), { recursive: true });
    let jobStore;
    try {
        const fileContent = await readFile(jobFilePath, "utf8");
        jobStore = JSON.parse(fileContent);
    }
    catch (error) {
        if (error instanceof Error && // instanceof  is used to check if the error is an instance of the Error class, which is a built-in JavaScript class for handling errors.
            "code" in error &&
            error.code === "ENOENT") {
            jobStore = { jobs: [] };
        }
        else {
            throw error;
        }
    }
    const job = jobStore.jobs.find((item) => item.jobId === jobId);
    if (!job) {
        throw new Error(`Job not found: ${jobId}`);
    }
    job.status = status;
    await writeFile(jobFilePath, JSON.stringify(jobStore, null, 2), "utf8");
}
export async function updateClipStatus(jobId, part, status, videoId) {
    await mkdir(path.dirname(jobFilePath), { recursive: true });
    let jobStore;
    const fileContent = await readFile(jobFilePath, "utf8");
    jobStore = JSON.parse(fileContent);
    try {
        const job = jobStore.jobs.find((job) => job.jobId === jobId);
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }
        const clip = job.clips.find((clip) => clip.part === part);
        if (!clip) {
            throw new Error(`Clip ${part} not found in job ${jobId}`);
        }
        clip.status = status;
        clip.videoId = videoId;
        await writeFile(jobFilePath, JSON.stringify(jobStore, null, 2), "utf8");
    }
    catch (error) {
        throw error;
    }
}
export async function createJob(job) {
    await mkdir(path.dirname(jobFilePath), { recursive: true });
    let jobStore;
    try {
        const fileContent = await readFile(jobFilePath, "utf8");
        jobStore = JSON.parse(fileContent);
    }
    catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            jobStore = { jobs: [] };
        }
        else {
            throw error;
        }
    }
    jobStore.jobs.push(job);
    await writeFile(jobFilePath, JSON.stringify(jobStore, null, 2), "utf8");
}
export async function getJobById(jobId) {
    try {
        const fileContent = await readFile(jobFilePath, "utf8");
        const jobStore = JSON.parse(fileContent);
        const result = jobStore.jobs.find((job) => job.jobId === jobId);
        return result;
    }
    catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
            console.error(error);
            return undefined;
        }
        throw error;
    }
}
export function countCompletedClips(job) {
    const result = job.clips.filter((num) => num.status === "completed");
    return result.length;
}
export function countPendingClips(job) {
    const result = job.clips.filter((num) => num.status === "pending");
    return result.length;
}
export function countFailedClips(job) {
    const result = job.clips.filter((num) => num.status === "failed");
    return result.length;
}
export function getJobProgress(job) {
    const totalClips = job.clips.length;
    if (totalClips === 0) {
        return 0;
    }
    return (countCompletedClips(job) / totalClips) * 100;
}
//# sourceMappingURL=job.service.js.map