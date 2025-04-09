import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    const result = dao.enrollUser(userId, courseId);
    if (result) {
      res.json(result);
    } else {
      res.status(409).json({ error: "Already enrolled" });
    }
  });

  app.delete("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    const success = dao.unenrollUser(userId, courseId);
    if (!success) return res.status(404).json({ error: "Enrollment not found" });
    res.sendStatus(200);
  });

  app.get("/api/enrollments", (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  });
}
