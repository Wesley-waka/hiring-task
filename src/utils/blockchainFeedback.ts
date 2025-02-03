
export const submitBlockchainFeedback = async (
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