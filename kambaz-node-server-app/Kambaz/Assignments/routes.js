import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.post("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = dao.createAssignment(assignment);
    res.json(newAssignment);
  });

  app.get("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body);
    if (!updated) return res.status(404).send({ error: "Assignment not found" });
    res.json(updated);
  });

  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const deleted = dao.deleteAssignment(assignmentId);
    if (!deleted) return res.status(404).send({ error: "Assignment not found" });
    res.sendStatus(200);
  });

  app.get("/api/assignments/:assignmentId", (req, res) => {
    const assignment = dao.findAssignmentById(req.params.assignmentId);
    if (!assignment) return res.status(404).send({ error: "Not found" });
    res.json(assignment);
  });
}
