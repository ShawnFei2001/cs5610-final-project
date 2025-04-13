import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Unnamed Quiz" },
    description: { type: String, default: "" },
    quizType: {
      type: String,
      enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
      default: "Graded Quiz",
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, // in minutes
    multipleAttempts: { type: Boolean, default: false },
    showCorrectAnswers: { type: Boolean, default: false },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: { type: Date },
    availableDate: { type: Date },
    untilDate: { type: Date },
    published: { type: Boolean, default: false },
    questions: [
      {
        questionType: {
          type: String,
          enum: ["Multiple Choice", "True/False", "Fill in the Blank"],
          required: true,
        },
        title: { type: String, required: true },
        points: { type: Number, required: true },
        question: { type: String, required: true },
        // For Multiple Choice
        choices: [
          {
            text: { type: String },
            isCorrect: { type: Boolean },
          },
        ],
        // For True/False
        correctAnswer: { type: Boolean },
        // For Fill in the Blank
        blanks: [{ text: { type: String } }],
      },
    ],
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    attempts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
        answers: [
          {
            questionId: { type: mongoose.Schema.Types.ObjectId },
            answer: { type: mongoose.Schema.Types.Mixed },
            isCorrect: { type: Boolean },
          },
        ],
        score: { type: Number },
        dateTaken: { type: Date, default: Date.now },
      },
    ],
  },
  { collection: "quizzes", timestamps: true }
);

export default schema;