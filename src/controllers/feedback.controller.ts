import { Request, Response } from "express";
import { User } from "@prisma/client";
import { prisma } from "../setup/database.setup";
import { sentimentHandler } from "@/utils/sentiment";
import { errorHandlerWrapper } from "@/utils";
import { feedbackContract } from "@/utils/web3";

// Type Definitions
export interface SentimentAnalysisResult {
  score: number;
  numWords: number;
  numHits: number;
  average: number;
  type: string;
  locale: string;
  vote: string;
}

interface FeedbackRequestBody {
  message: string;
  address?: string; // Made optional since it's not always required
}

interface BlockchainFeedback {
  text: string;
  sentiments: SentimentAnalysisResult[];
  user: string;
  userName: string;
}

// Utility Functions
const validateUser = async (name: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { name: String(name) },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const submitBlockchainFeedback = async (
  message: string,
  address: string,
  sentimentAnalysis: SentimentAnalysisResult[]
): Promise<string> => {
  const receipt = await feedbackContract.methods
    .addFeedback(
      message,
      sentimentAnalysis.map((s) => Math.round(s.score * 1000)),
      sentimentAnalysis.map((s) => s.numWords),
      sentimentAnalysis.map((s) => s.numHits),
      sentimentAnalysis.map((s) => Math.round(s.average * 1000)),
      sentimentAnalysis.map((s) => s.type),
      sentimentAnalysis.map((s) => s.locale),
      sentimentAnalysis.map((s) => s.vote)
    )
    .send({ from: address, gas: "3000000" });

  return receipt.transactionHash;
};

// Controller Handlers
const createFeedbackHandler = async (
  req: Request<{}, {}, FeedbackRequestBody>,
  res: Response
) => {
  const { message, address } = req.body;
  const { name } = req.query;

  if (!message || !name) {
    return res.status(400).json({
      error: !message ? "Message is required" : "Name parameter is required"
    });
  }

  try {
    const user = await validateUser(String(name));
    const sentimentAnalysis = await sentimentHandler(message);

    let transactionHash: string | null = null;
    if (address) {
      transactionHash = await submitBlockchainFeedback(
        message,
        address,
        [sentimentAnalysis]
      );
    }

    console.log('sentimentAnalysis', [sentimentAnalysis]);

    const feedback = await prisma.feedback.create({
      data: {
        text: message,
        userName: user.name,
        sentiments: {
          create: sentimentAnalysis,
        },
      },
      include: {
        sentiments: true,
      },
    });

    return res.status(201).json({ feedback, transactionHash });
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error creating feedback:", error);
    return res.status(500).json({ error: "Failed to submit feedback." });
  }
};

const getFeedbacksHandler = async (req: Request, res: Response) => {
  const { vote } = req.query;

  try {
    const feedbackCount: number = await feedbackContract.methods.getFeedbackCount().call();
    const feedbacks: BlockchainFeedback[] = [];

    const fetchPromises = Array.from({ length: feedbackCount }, async (_, i) => {
      const feedback: BlockchainFeedback = await feedbackContract.methods.getFeedback(i).call();

      if (!vote || feedback.sentiments.some((s) => s.vote === vote)) {
        const user = await prisma.user.findUnique({
          where: { walletAddress: feedback.user.toLowerCase() },
        });

        return {
          text: feedback.text,
          sentiments: feedback.sentiments,
          user: feedback.user,
          userName: user?.name ?? "Unknown",
        };
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    const filteredFeedbacks = results.filter((feedback): feedback is BlockchainFeedback =>
      feedback !== null
    );

    return res.status(200).json(filteredFeedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return res.status(500).json({ error: "Failed to fetch feedback from the blockchain." });
  }
};

const getFeedbacksByNameHandler = async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }

  try {
    const user = await validateUser(String(name));

    if (user.walletAddress) {
      const feedbackCount: number = await feedbackContract.methods.getFeedbackCount().call();
      const feedbacks: BlockchainFeedback[] = [];

      const fetchPromises = Array.from({ length: feedbackCount }, async (_, i) => {
        const feedback: BlockchainFeedback = await feedbackContract.methods.getFeedback(i).call();
        if (feedback.user.toLowerCase() === user.walletAddress?.toLowerCase()) {
          return {
            text: feedback.text,
            sentiments: feedback.sentiments,
            user: feedback.user,
            userName: user.name,
          };
        }
        return null;
      });

      const results = await Promise.all(fetchPromises);
      const filteredFeedbacks = results.filter((feedback): feedback is BlockchainFeedback =>
        feedback !== null
      );

      if (filteredFeedbacks.length === 0) {
        return res.status(404).json({ error: "No feedbacks found for this user" });
      }

      return res.status(200).json(filteredFeedbacks);
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { userName: user.name },
      include: { sentiments: true },
    });

    if (feedbacks.length === 0) {
      return res.status(404).json({ error: "No feedbacks found for this user" });
    }

    return res.status(200).json(feedbacks);
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error fetching feedbacks by name:", error);
    return res.status(500).json({ error: "Failed to fetch feedback." });
  }
};

export const createFeedback = errorHandlerWrapper(createFeedbackHandler);
export const getFeedbacks = errorHandlerWrapper(getFeedbacksHandler);
export const getFeedbacksByName = errorHandlerWrapper(getFeedbacksByNameHandler);