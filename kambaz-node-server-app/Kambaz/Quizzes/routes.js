import * as quizzesDao from "./dao.js";
import * as questionsDao from "./Questions/dao.js";
import * as answersDao from "./Questions/dao.js";

export default function QuizRoutes(app) {
    app.post("/api/quizzes/courses/:courseId/quizzes", async (req, res) => {
        const newQuiz = await quizzesDao.createQuiz({ ...req.body, course: req.params.courseId });
        res.json(newQuiz);
      });
    
      app.get("/api/quizzes/courses/:courseId/quizzes", async (req, res) => {
        const quizzes = await quizzesDao.findQuizzesForCourse(req.params.courseId);
        res.json(quizzes);
      });
    
      app.put("/api/quizzes/:quizId", async (req, res) => {
        const updated = await quizzesDao.updateQuiz(req.params.quizId, req.body);
        res.json(updated);
      });
    
      app.delete("/api/quizzes/:quizId", async (req, res) => {
        await quizzesDao.deleteQuiz(req.params.quizId);
        res.sendStatus(200);
      });
    
      app.get("/api/quizzes/:quizId/questions", async (req, res) => {
        const questions = await questionsDao.findQuestionsForQuiz(req.params.quizId);
        res.json(questions);
      });
    
      app.post("/api/quizzes/:quizId/questions", async (req, res) => {
        const newQuestion = await questionsDao.createQuestion({ ...req.body, quizId: req.params.quizId });
        res.json(newQuestion);
      });
    
      app.put("/api/quizzes/:quizId/questions/:qid", async (req, res) => {
        const updated = await questionsDao.updateQuestion(req.params.qid, req.body);
        res.json(updated);
      });
    
      app.delete("/api/quizzes/:quizId/questions/:qid", async (req, res) => {
        await questionsDao.deleteQuestion(req.params.qid);
        res.sendStatus(200);
      });
    
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
    }