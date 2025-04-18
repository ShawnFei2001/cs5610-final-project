// Kambaz/Modules/Answers/schema.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionModel" },
      answer: mongoose.Schema.Types.Mixed,
    }
  ],
  score: Number,
  attemptDate: { type: Date, default: Date.now },
});

export default answerSchema;