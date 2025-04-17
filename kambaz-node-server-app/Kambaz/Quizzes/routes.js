import * as quizzesDao from "./dao.js";

export default function QuizRoutes(app) {
    app.post("/api/quizzes/courses/:courseId/quizzes", async (req, res) => {
        const newQuiz = await quizzesDao.createQuiz({ ...req.body, course: req.params.courseId });
        res.json(newQuiz);
      });
    
      app.get("/api/quizzes/courses/:courseId/quizzes", async (req, res) => {
        const quizzes = await quizzesDao.findQuizzesForCourse(req.params.courseId);
        console.log(quizzes);
        res.json(quizzes);
      });
    
      app.put("/api/quizzes/:quizId", async (req, res) => {
        const updated = await quizzesDao.updateQuiz(req.params.quizId, req.body);
        res.json(updated);
      });

      app.post("/api/quizzes/:quizId", async (req, res) => {
        const added = await quizzesDao.createQuiz(req.body);
        res.json(added);
      });
    
      app.delete("/api/quizzes/:quizId", async (req, res) => {
        await quizzesDao.deleteQuiz(req.params.quizId);
        res.sendStatus(200);
      });
      app.get("/api/quizzes/:quizId", async (req, res) => {
        const quiz = await quizzesDao.findQuizById(req.params.quizId);
        res.json(quiz);
      });
    }