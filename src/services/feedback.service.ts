import { prisma } from "@/setup/database.setup";
import { sentimentHandler } from "@/utils/sentiment";
import { submitBlockchainFeedback } from "@/utils/blockchainFeedback";
import { validateUser } from "@/utils/userValidate";
import { BlockchainFeedback } from "@/types";
import { feedbackContract } from "@/utils/web3";
import jwt, { TokenPayload } from 'jsonwebtoken';

export class FeedbackService {
  async createFeedback(message: string, address: string, authHeader: string) {
    if (!message) {
      throw new Error("Message is required");
    }

    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error("Invalid authorization header format");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const username = decoded.username;
    if (!username) {
      throw new Error("Invalid token payload");
    }

    // Process feedback
    const user = await validateUser(username);
    const sentimentAnalysis = await sentimentHandler(message);
    let transactionHash: string | null = null;

    if (address) {
      transactionHash = await submitBlockchainFeedback(
        message,
        address,
        [sentimentAnalysis]
      );
    }

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

    return { feedback, transactionHash };
  }

  async getFeedbacks(vote?: string, walletAddress?: string) {
    if (walletAddress) {
      return this.getBlockchainFeedbacks(vote);
    } else {
      return this.getDatabaseFeedbacks(vote);
    }
  }

  private async getBlockchainFeedbacks(vote?: string) {
    const feedbackCount: number = await feedbackContract.methods.getFeedbackCount().call();
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
    return results.filter((feedback): feedback is BlockchainFeedback => feedback !== null);
  }

  private async getDatabaseFeedbacks(vote?: string) {
    const whereConditions: any = {};

    if (vote) {
      whereConditions.sentiments = {
        some: {
          vote: vote.toString()
        }
      };
    }

    return prisma.feedback.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            name: true,
            walletAddress: true
          }
        },
        sentiments: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getFeedbacksByName(authHeader: string) {
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error("Invalid authorization header format");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const username = decoded.username;
    if (!username) {
      throw new Error("Invalid token payload");
    }

    const user = await validateUser(username);

    if (user.walletAddress) {
      return this.getBlockchainFeedbacksByUser(user);
    }

    return this.getDatabaseFeedbacksByUser(user);
  }

  private async getBlockchainFeedbacksByUser(user: any) {
    const feedbackCount: number = await feedbackContract.methods.getFeedbackCount().call();
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
    return results.filter((feedback): feedback is BlockchainFeedback => feedback !== null);
  }

  private async getDatabaseFeedbacksByUser(user: any) {
    return prisma.feedback.findMany({
      where: { userName: user.name },
      include: { sentiments: true },
    });
  }
}

// feedback.service.ts
export default new FeedbackService();