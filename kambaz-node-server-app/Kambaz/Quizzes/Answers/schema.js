import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  userId: { type: String, required: true },
  answers: [
    {
      questionId: String,
      answer: mongoose.Schema.Types.Mixed,
    },
  ],
  score: Number,
  attemptDate: { type: Date, default: Date.now },
});

export default answerSchema;