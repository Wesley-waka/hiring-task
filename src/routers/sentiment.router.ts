import { sentimentHandler } from "@/services/sentiment.service";
import { Router } from "express";

export const sentimentRouter = Router();

sentimentRouter.post('/analyze', sentimentHandler);