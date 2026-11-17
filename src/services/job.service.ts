import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const jobFilePath = path.resolve("tmp/jobs.json");

type JobStatus =
  | "processing"
  | "completed"
  | "partial_failed"
  | "failed";

type ClipStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

interface Job {
  jobId: string;
  status: JobStatus;
  failedAt?: number;
  clips: {
    part: number;
    status: ClipStatus;
    videoId: string | null;
  }[];
}

interface JobStore {
  jobs: Job[];
}

export async function updateJobStatus(
  jobId: string,
  status:"processing",
): Promise<void> {
  await mkdir(path.dirname(jobFilePath), { recursive: true });

  let jobStore: JobStore;

  try {
    const fileContent = await readFile(jobFilePath, "utf8");
    jobStore = JSON.parse(fileContent) as JobStore;
  } catch (error) {
    if (
      error instanceof Error && // instanceof  is used to check if the error is an instance of the Error class, which is a built-in JavaScript class for handling errors.
      "code" in error &&
      error.code === "ENOENT"
    ) {
      jobStore = { jobs: [] };
    } else {
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

export async function updateClipStatus(jobId:string,
  part: number,
  status: "pending",
  videoId: string | null
):Promise<void>{

  await mkdir(path.dirname(jobFilePath), { recursive: true });
   let jobStore: JobStore;
  const fileContent = await readFile(jobFilePath, "utf8");
  jobStore = JSON.parse(fileContent) as JobStore ;

  try {
    const job = jobStore.jobs.find((job) => job.jobId === jobId);

  if (!job) {
  throw new Error(`Job not found: ${jobId}`);
}

 const clip = job.clips.find((clip) => 
    clip.part === part ) ;

 if (!clip) {
  throw new Error(`Clip ${part} not found in job ${jobId}`);
}

  clip.status = status;
  clip.videoId = videoId 

  await writeFile(jobFilePath, JSON.stringify(jobStore, null , 2), "utf8")
  } catch (error) {
    throw error ;
  }
  

}



export async function createJob(job: Job): Promise<void> {
  await mkdir(path.dirname(jobFilePath), { recursive: true });
  let jobStore: JobStore;

  try {
    const fileContent = await readFile(jobFilePath, "utf8");
    jobStore = JSON.parse(fileContent) as JobStore;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      jobStore = { jobs: [] };
    } else {
      throw error;
    }
  }

  jobStore.jobs.push(job);
  await writeFile(jobFilePath, JSON.stringify(jobStore, null ,2), "utf8");
}

export async function getJobById(jobId: string): Promise< Job | undefined >{

 try {
  const fileContent = await readFile(jobFilePath, "utf8");
 const jobStore = JSON.parse(fileContent) as JobStore ;

 const result = jobStore.jobs.find((job) => job.jobId === jobId)

 return result ;
 } catch (error) {
  if(typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT"){
    console.error(error);
    return undefined ;

  }
   throw error;
 }
 



}


export function countCompletedClips(job:Job): number {

  return job.clips.filter(
  (clip) => clip.status === "completed"
).length;
}

export function countPendingClips(job:Job): number {

  const result = job.clips.filter((num) => num.status === "pending" );

  return result.length
}

export function countFailedClips(job:Job): number {

  const result = job.clips.filter((num) => num.status === "failed" );

  return result.length
}

export function getJobProgress(job: Job): number {
  const totalClips = job.clips.length;

  if (totalClips === 0) {
    return 0;
  }

  return (countCompletedClips(job) / totalClips) * 100;
} 