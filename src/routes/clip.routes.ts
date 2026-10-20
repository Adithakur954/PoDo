import { Router } from "express";  //Router is an Express feature that lets us create a small, separate group of routes.
import {
  createClipPlanController,
  processVideoController
} from "../controllers/clip.controller.js";

import {upload} from "../middleware/upload.middleware.js";  //importing the upload middleware which is used to handle file uploads

const router = Router();

router.post("/plan", createClipPlanController);  //this is the route for creating a clip plan
router.post("/process", upload.single("video"), //"Expect one uploaded file whose multipart field name is video."
 processVideoController);  //this is the route for processing a video upload

 
  export default router;


