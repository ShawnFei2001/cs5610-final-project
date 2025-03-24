import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import * as db from "../../Database";

export default function PeopleTable() {
    const { cid } = useParams();
    const { users, enrollments } = db;

    const enrolledUsers = enrollments
        .filter(enrollment => enrollment.course === cid)
        .map(enrollment => enrollment.user);

    const userSections: Record<string, Set<string>> = {};

    enrollments.forEach(enrollment => {
        if (!userSections[enrollment.user]) {
            userSections[enrollment.user] = new Set();
        }
        userSections[enrollment.user].add(enrollment.course);
    });

    const uniqueUsers = users.filter(user => enrolledUsers.includes(user._id));

    return (
        <div id="wd-people-table">
            <Table striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Login ID</th>
                        <th>Sections</th>
                        <th>Role</th>
                        <th>Last Activity</th>
                        <th>Total Activity</th>
                    </tr>
                </thead>
                <tbody>
                    {uniqueUsers.map((user) => (
                        <tr key={user._id}>
                            <td className="wd-full-name text-nowrap">
                                <FaUserCircle className="me-2 fs-1 text-secondary" />
                                <span className="wd-first-name">{user.firstName}</span>
                                <span className="wd-last-name"> {user.lastName}</span>
                            </td>
                            <td className="wd-login-id">{user.loginId}</td>
                            <td className="wd-section">{[...(userSections[user._id] || new Set())].join(", ")}</td>
                            <td className="wd-role">{user.role}</td>
                            <td className="wd-last-activity">{user.lastActivity}</td>
                            <td className="wd-total-activity">{user.totalActivity}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
