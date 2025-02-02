// const { SentimentAnalyzer } = require('node-nlp');
import { errorHandlerWrapper } from '@/utils';
import { Request, Response } from 'express';
import { SentimentAnalyzer } from 'node-nlp';

// const sentiment = new SentimentAnalyzer({ language: 'en' });
// sentiment
//   .getSentiment('I like cats')
//   .then(result:  => console.log(result));

export const sentimentHandler = async (
  sentence
) => {
  try {
    // Initialize analyzer with English language
    const sentiment = new SentimentAnalyzer({ language: 'en' });

    // Perform sentiment analysis using senticon algorithm
    const result = await sentiment.getSentiment(sentence, 'en', ['senticon']);

    return result;
  } catch (error) {
    const errorMessage = error ? error.message : 'Unknown error occurred';
    return {
      error: 'SENTIMENT_ANALYSIS_FAILED',
      message: errorMessage
    };
  }
};