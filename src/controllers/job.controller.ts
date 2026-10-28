import type { Request, Response } from "express";
import { countCompletedClips, countFailedClips, countPendingClips, getJobById, getJobProgress } from "../services/job.service.js";



export async function getJobByController( req:Request,res:Response): Promise<void>{

  try {
    const { jobId  } = req.params;

    
    if (typeof jobId !== "string" || jobId.length === 0) {
      res.status(400).json({
        success: false,
        message: "A valid jobId is required",
      });
      return;
    }

  const job = await getJobById(jobId);

  
  

  if(!job){
    res.status(404).json({
      success: false,
      message:"Job is not Found"
    })

    return;
  }
  const totalClips = job.clips.length;

  const progress = getJobProgress(job)
  const completedClips = countCompletedClips(job);
  const pendingClips = countPendingClips(job);
  const failedClips = countFailedClips(job);  
  res.status(200).json({
  success: true,
  message: "Job Founded",
  data: {...job,totalClips, progress, completedClips, pendingClips, failedClips}
})
  } catch (error) {
    res.status(500).json({
      success: false,
      message:"Failed to fetch the job"
    })
  }
}

