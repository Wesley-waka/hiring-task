/** @format */

import { feedbackController } from "@/controllers";
import { Router } from "express";

export const feedbackRouter = Router();

feedbackRouter.post("/create", feedbackController.createFeedback);
feedbackRouter.get("/all", feedbackController.getFeedbacks);
feedbackRouter.get("/get", feedbackController.getFeedbacksByName);
