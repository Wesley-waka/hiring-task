//feedback.controller.ts

import { Request, Response } from "express";
import { prisma } from "../setup/database.setup";
import { errorHandlerWrapper } from "@/utils";
import { feedbackContract } from "@/utils/web3";
import jwt, { TokenPayload } from 'jsonwebtoken';
import feedbackService from "@/services/feedback.service";

const createFeedbackHandler = async (req: Request, res: Response) => {
  const { message, address } = req.body;

  const newFeedback = await prisma.feedback.createFeedback({
    message,
    address
  });

  if (newFeedback) {
    res.status(201).json(newFeedback);
  } else {
    res.status(400).json({ message: 'Feedback not created.Please Try Again' });
  }
}


const getFeedbacksHandler = async (req: Request, res: Response) => {

  const { vote } = req.query;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  const walletAddress = decoded.walletAddress;

  feedbackService.getFeedbacks(vote, walletAddress)
}


const getFeedbacksByNameHandler = async (req: Request, res: Response) => {

  const { name } = req.query;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  const walletAddress = decoded.walletAddress;

  feedbackService.getFeedbacksByName(name, walletAddress)
}



export const createFeedback = errorHandlerWrapper(createFeedbackHandler);
export const getFeedbacks = errorHandlerWrapper(getFeedbacksHandler);
export const getFeedbacksByName = errorHandlerWrapper(getFeedbacksByNameHandler);