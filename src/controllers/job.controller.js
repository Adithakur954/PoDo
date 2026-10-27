import { getJobById } from "../services/job.service.js";
export async function getJobByController(req, res) {
    try {
        const { jobId } = req.params;
        if (typeof jobId !== "string" || jobId.length === 0) {
            res.status(400).json({
                success: false,
                message: "A valid jobId is required",
            });
            return;
        }
        const job = await getJobById(jobId);
        if (!job) {
            res.status(404).json({
                success: false,
                message: "Job is not Found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Job Founded",
            data: job
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch the job"
        });
    }
}
//# sourceMappingURL=job.controller.js.map