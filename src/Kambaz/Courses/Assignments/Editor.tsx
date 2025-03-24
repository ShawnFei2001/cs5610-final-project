import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";

export default function AssignmentEditor() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid, aid } = useParams(); // Get course ID and assignment ID
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch assignments from Redux state
  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);

  // Find assignment by ID (if editing an existing one)
  const existingAssignment = assignments.find((a: any) => a._id === aid);

  // Define assignment state (prefill existing or new values)
  const [assignment, setAssignment] = useState(
    existingAssignment || {
      _id: aid || "", // If new, generate ID on save
      title: "",
      description: "",
      points: 100,
      dueDate: "",
      availableFrom: "",
      availableUntil: "",
      course: cid,
    }
  );

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSave = () => {
    if (existingAssignment) {
      dispatch(updateAssignment(assignment)); // Update existing assignment
    } else {
      dispatch(addAssignment({ ...assignment, _id: new Date().getTime().toString() })); // Add new assignment
    }
    navigate(`/Kambaz/Courses/${cid}/Assignments`); // Redirect back to assignments page
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
      ) : (<div className="mb-4">
        <Row>
          <Col>
            <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
              <Button variant="secondary">Back</Button>
            </Link>
          </Col>
        </Row>
      </div>)}
    </Container>
  );
}
