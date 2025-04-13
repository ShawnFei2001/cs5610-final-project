import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as usersClient from "./client";
import { useSelector } from "react-redux";
import PeopleDetails from "./Details";

export default function PeopleTable({ users = [] }: { users?: any[] }) {
  const { cid } = useParams();
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    loginId: "",
    role: "STUDENT",
    lastActivity: "",
    totalActivity: 0,
  });

  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const enrollments = useSelector((state: any) => state.enrollmentReducer.enrollments);

  const loadUsers = async () => {
    if (!cid) return;
    const data = await usersClient.findUsersForCourse(cid);
    // setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, [cid]);

  const userSections: Record<string, Set<string>> = {};
  enrollments.forEach((enrollment: any) => {
    if (!userSections[enrollment.user]) userSections[enrollment.user] = new Set();
    userSections[enrollment.user].add(enrollment.course);
  });

  const handleSave = async () => {
    if (editingUser) {
      const updated = await usersClient.updateUser({ ...editingUser, ...formData });
      // setUsers(users.map(u => u._id === updated._id ? updated : u));
    } else {
      const created = await usersClient.createUser(formData);
      // setUsers([...users, created]);
    }
    setShowModal(false);
    setFormData({ firstName: "", lastName: "", loginId: "", role: "STUDENT", lastActivity: "", totalActivity: 0 });
    setEditingUser(null);
  };

  const handleDelete = async (userId: string) => {
    await usersClient.deleteUser(userId);
    // setUsers(users.filter(u => u._id !== userId));
  };

  return (
    <div id="wd-people-table">
      <PeopleDetails />
      {currentUser?.role === "FACULTY" && (
        <Button className="mb-3" onClick={() => setShowModal(true)}>+ Add User</Button>
      )}
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Sections</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
            {currentUser?.role === "FACULTY" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="text-nowrap">
                <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </Link>
              </td>
              <td>{user.loginId}</td>
              <td>{[...(userSections[user._id] || new Set()).values()].join(", ")}</td>
              <td>{user.role}</td>
              <td>{user.lastActivity}</td>
              <td>{user.totalActivity}</td>
              {currentUser?.role === "FACULTY" && (
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => {
                    setEditingUser(user);
                    setFormData(user);
                    setShowModal(true);
                  }}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Login ID</Form.Label>
              <Form.Control value={formData.loginId} onChange={(e) => setFormData({ ...formData, loginId: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="STUDENT">STUDENT</option>
                <option value="FACULTY">FACULTY</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Last Activity</Form.Label>
              <Form.Control value={formData.lastActivity} onChange={(e) => setFormData({ ...formData, lastActivity: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Total Activity</Form.Label>
              <Form.Control type="number" value={formData.totalActivity} onChange={(e) => setFormData({ ...formData, totalActivity: parseInt(e.target.value || "0") })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editingUser ? "Update" : "Create"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
