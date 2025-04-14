import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  title: String,
  text: String,
  type: String, // 'True/False', 'Multiple Choice', 'Fill in the Blank'
  choices: [String], // optional for multiple choice
  correctAnswer: mongoose.Schema.Types.Mixed,
  points: Number,
});

export default questionSchema;