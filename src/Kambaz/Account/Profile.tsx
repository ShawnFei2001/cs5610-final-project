import { Link } from "react-router-dom";
import { Button, Col, Form, FormControl, FormGroup, Row, FormSelect } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>

      <Form>
        <FormGroup as={Row} className="mb-2" controlId="wd-username">
          <Col sm={6}>
            <FormControl type="text" defaultValue="alice" placeholder="Username" />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-2" controlId="wd-password">
          <Col sm={6}>
            <FormControl type="password" defaultValue="123" placeholder="Password" />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-2" controlId="wd-firstname">
          <Col sm={6}>
            <FormControl type="text" defaultValue="Alice" placeholder="First Name" />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-2" controlId="wd-lastname">
          <Col sm={6}>
            <FormControl type="text" defaultValue="Wonderland" placeholder="Last Name" />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-2" controlId="wd-dob">
          <Col sm={6}>
            <FormControl type="date" defaultValue="2000-01-01" />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-2" controlId="wd-email">
          <Col sm={6}>
            <FormControl type="email" defaultValue="alice@wonderland" placeholder="Email" />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3" controlId="wd-role">
          <Col sm={6}>
            <FormSelect defaultValue="FACULTY">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
            </FormSelect>
          </Col>
          <Link to="/Kambaz/Account/Signin">
            <Button variant="danger" className="w-50">Sign out</Button>
          </Link>
        </FormGroup>
      </Form>
    </div>
  );
}
