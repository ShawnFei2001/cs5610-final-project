import * as questionsDao from "./Questions/dao.js";
import * as answersDao from "./Questions/dao.js";
import AnswerModel from "./model.js";
import QuestionModel from "../Questions/model.js";

export default function AnswerRoutes(app) {
    app.post("/api/quizzes/:quizId/answers", async (req, res) => {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(403);
  
      const { answers } = req.body;
      const questions = await questionsDao.findQuestionsForQuiz(req.params.quizId);
      let score = 0;
  
      questions.forEach((q) => {
        const a = answers.find((ans) => ans.questionId === q._id.toString());
        if (JSON.stringify(a?.answer) === JSON.stringify(q.correctAnswer)) {
          score += q.points;
        }
      });
  
      const result = await answersDao.createAnswer({
        quizId: req.params.quizId,
        userId: currentUser._id,
        answers,
        score,
      });
  
      res.json(result);
    });
  
    app.get("/api/quizzes/:quizId/answers", async (req, res) => {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(403);
  
      const lastAttempt = await answersDao.findLatestAnswer(req.params.quizId, currentUser._id);
      res.json(lastAttempt);
    });
    // Load previous answer progress
  app.get("/api/quiz-attempts/:qid", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(403);

    const last = await AnswerModel.findOne({
      quizId: req.params.qid,
      userId: currentUser._id,
    }).sort({ attemptDate: -1 });

    if (!last) return res.json({ answers: {}, savedAt: null });

    const mappedAnswers = {};
    last.answers.forEach(a => mappedAnswers[a.questionId] = a.answer);

    res.json({
      answers: mappedAnswers,
      savedAt: last.attemptDate,
    });
  });

  // Submit final quiz answers
  app.post("/api/quiz-attempts/:qid/submit", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(403);

    const { answers } = req.body;
    const questions = await QuestionModel.find({ quizId: req.params.qid });

    let score = 0;
    const results = {};

    questions.forEach((q) => {
      const a = answers[q._id.toString()];
      const isCorrect = JSON.stringify(a) === JSON.stringify(q.correctAnswer);
      results[q._id.toString()] = isCorrect;
      if (isCorrect) score += q.points;
    });

    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

    await AnswerModel.create({
      quizId: req.params.qid,
      userId: currentUser._id,
      answers: Object.entries(answers).map(([qid, answer]) => ({
        questionId: qid,
        answer,
      })),
      score,
    });

    res.json({
      score,
      totalPoints,
      results,
    });
  });

  // Auto-save progress
  app.put("/api/quiz-attempts/:qid", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(403);

    const { answers, savedAt } = req.body;

    await AnswerModel.findOneAndUpdate(
      { quizId: req.params.qid, userId: currentUser._id },
      {
        quizId: req.params.qid,
        userId: currentUser._id,
        answers: Object.entries(answers).map(([qid, answer]) => ({
          questionId: qid,
          answer,
        })),
        attemptDate: savedAt,
      },
      { upsert: true }
    );

    res.sendStatus(204);
  });
  }