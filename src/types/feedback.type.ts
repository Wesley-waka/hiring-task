import { SentimentAnalysisResult } from './sentiment.type';

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

export {
  FeedbackRequestBody,
  BlockchainFeedback
}