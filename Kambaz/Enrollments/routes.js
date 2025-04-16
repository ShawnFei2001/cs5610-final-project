import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Get all enrollments
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await dao.findAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Error fetching enrollments", error: error.message });
    }
  });

  // Enroll a user in a course
  app.post("/api/enrollments", async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const result = await dao.enrollUser(userId, courseId);
      if (result) {
        res.json(result);
      } else {
        res.status(409).json({ error: "Already enrolled" });
      }
    } catch (error) {
      console.error("Error enrolling user:", error);
      res.status(500).json({ message: "Error enrolling user", error: error.message });
    }
  });

  // Unenroll a user from a course
  app.delete("/api/enrollments", async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const success = await dao.unenrollUser(userId, courseId);
      if (!success) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error unenrolling user:", error);
      res.status(500).json({ message: "Error unenrolling user", error: error.message });
    }
  });
}