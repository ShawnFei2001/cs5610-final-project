// src/Kambaz/Courses/Assignments/Editor.tsx
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import * as assignmentsClient from "./client";

export default function AssignmentEditor() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState({
    _id: "",
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    course: cid,
  });

  useEffect(() => {
    // If we have an assignment ID, try to find the existing assignment
    if (aid) {
      // First check if it's in the Redux store
      const existingAssignment = assignments.find((a: any) => a._id === aid);
      if (existingAssignment) {
        setAssignment(existingAssignment);
      } else {
        // Otherwise, fetch it from the API
        fetchAssignment();
      }
    }
  }, [aid, assignments]);

  const fetchAssignment = async () => {
    if (!aid) return;
    
    setLoading(true);
    try {
      const result = await assignmentsClient.findAssignmentById(aid);
      if (result && typeof result === 'object' && '_id' in result) {
        setAssignment(result);
      }
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (assignment._id) {
        // Update existing assignment
        // Just make the API call, don't test the result
        await assignmentsClient.updateAssignment(assignment);
        // Update Redux store
        dispatch(updateAssignment(assignment));
      } else {
        // Create new assignment
        const newAssignment = {
          ...assignment,
          course: cid || ""
        };
        
        // Make API call
        await assignmentsClient.createAssignmentForCourse(cid as string, newAssignment);
        // Update Redux store with local data
        dispatch(addAssignment(newAssignment));
      }
      
      // Navigate back to assignments list
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Failed to save assignment:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <h4>{assignment._id ? "Edit Assignment" : "New Assignment"}</h4>
      <Form.Control 
        type="text" 
        name="title" 
        value={assignment.title || ""} 
        onChange={handleChange} 
        className="mb-3" 
        placeholder="Assignment Title"
      />

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control 
          as="textarea" 
          name="description" 
          rows={4} 
          value={assignment.description || ""} 
          onChange={handleChange} 
          placeholder="Assignment Description"
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Points</Form.Label>
            <Form.Control 
              type="number" 
              name="points" 
              value={assignment.points || 100} 
              onChange={handleChange} 
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Due Date</Form.Label>
            <Form.Control 
              type="date" 
              name="dueDate" 
              value={assignment.dueDate || ""} 
              onChange={handleChange} 
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Available from</Form.Label>
            <Form.Control 
              type="date" 
              name="availableFrom" 
              value={assignment.availableFrom || ""} 
              onChange={handleChange} 
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Available until</Form.Label>
            <Form.Control 
              type="date" 
              name="availableUntil" 
              value={assignment.availableUntil || ""} 
              onChange={handleChange} 
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="mb-4">
        <Row>
          <Col>
            <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
              <Button variant="secondary" className="me-2">Cancel</Button>
            </Link>
            {currentUser?.role === "FACULTY" && (
              <Button variant="primary" onClick={handleSave}>Save</Button>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
}