import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const jobFilePath = path.resolve("tmp/jobs.json");

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

interface JobStore {
  jobs: Job[];
}

export async function updateJobStatus(
  jobId: string,
  status: string,
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
