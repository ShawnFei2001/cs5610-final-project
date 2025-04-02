import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import * as assignmentsClient from "./client";

export default function AssignmentEditor() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);
  const existingAssignment = assignments.find((a: any) => a._id === aid);

  const [assignment, setAssignment] = useState(
    existingAssignment || {
      _id: aid || "",
      title: "",
      description: "",
      points: 100,
      dueDate: "",
      availableFrom: "",
      availableUntil: "",
      course: cid,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (existingAssignment) {
      const updated = await assignmentsClient.updateAssignment(assignment);
      dispatch(updateAssignment(updated));
    } else {
      const created = await assignmentsClient.createAssignmentForCourse(cid as string, assignment);
      dispatch(addAssignment(created));
    }
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  return (
    <Container className="mt-4">
      <h4>{existingAssignment ? "Edit Assignment" : "New Assignment"}</h4>
      <Form.Control type="text" name="title" value={assignment.title} onChange={handleChange} className="mb-3" />

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" name="description" rows={4} value={assignment.description} onChange={handleChange} />
      </Form.Group>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Points</Form.Label>
            <Form.Control type="number" name="points" value={assignment.points} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Due Date</Form.Label>
            <Form.Control type="date" name="dueDate" value={assignment.dueDate} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Available from</Form.Label>
            <Form.Control type="date" name="availableFrom" value={assignment.availableFrom} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Available until</Form.Label>
            <Form.Control type="date" name="availableUntil" value={assignment.availableUntil} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      {currentUser?.role === "FACULTY" ? (
        <div className="mb-4">
          <Row>
            <Col>
              <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
                <Button variant="secondary" className="me-2">Cancel</Button>
              </Link>
              <Button variant="primary" onClick={handleSave}>Save</Button>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="mb-4">
          <Row>
            <Col>
              <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
                <Button variant="secondary">Back</Button>
              </Link>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
}
