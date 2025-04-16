import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  });

  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const updated = await dao.updateAssignment(assignmentId, req.body);
    if (!updated) return res.status(404).send({ error: "Assignment not found" });
    res.json(updated);
  });

  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const deleted = await dao.deleteAssignment(assignmentId);
    if (!deleted) return res.status(404).send({ error: "Assignment not found" });
    res.sendStatus(200);
  });

  app.get("/api/assignments/:assignmentId", async (req, res) => {
    const assignment = await dao.findAssignmentById(req.params.assignmentId);
    if (!assignment) return res.status(404).send({ error: "Not found" });
    res.json(assignment);
  });
}