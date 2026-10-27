import { Router } from "express";

import { getJobByController } from "../controllers/job.controller.js";

const router = Router();


router.get("/:jobId", getJobByController);

export default router