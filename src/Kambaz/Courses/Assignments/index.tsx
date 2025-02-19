import { BsGripVertical } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { useParams } from "react-router";
import * as db from "../../Database";

export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments;

  return (
    <div>
      <br /><br /><br /><br />
      <ul id="wd-assignments" className="list-group rounded-0">
        {assignments
          .filter((assignment) => assignment.course === cid)
          .map((assignment) => (
            <li key={assignment._id} className="wd-assignment list-group-item p-3 ps-1 d-flex align-items-center border-start border-3 border-success">
              <BsGripVertical className="me-2 fs-3 text-secondary" />
              <MdAssignment className="me-2 fs-4" />
              <div className="flex-grow-1">
                <a
                  href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                  className="fw-bold text-dark text-decoration-none"
                >
                  {assignment.title}
                </a>
                <div className="text-muted small">
                  <span className="text-danger">Multiple Modules</span> |
                  <strong> Not available until </strong> May 6 at 12:00am |
                  <strong> Due </strong> May 13 at 11:59pm | 100 pts
                </div>
              </div>
              <span className="me-1 position-relative">
                <FaCheckCircle style={{ top: "2px" }} className="text-success me-1 position-absolute fs-5" />
                <FaCircle className="text-white me-1 fs-6" />
                <IoEllipsisVertical className="fs-4" />
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
