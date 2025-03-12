import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { addAssignment, deleteAssignment} from "./reducer";
import AssignmentsControls from "./AssignmentsControls";
import AssignmentEditor from "./AssignmentEditor";
import { IoEllipsisVertical } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";

export default function Assignments() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();

  const [assignmentName, setAssignmentName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveAssignment = (assignment: any) => {
    dispatch(addAssignment({ ...assignment, course: cid }));
    setAssignmentName("");
    setIsEditing(false);
  };

  return (
    <div className="d-flex flex-column">
      {currentUser?.role === "FACULTY" && (
        <div className="mb-4">
          <AssignmentsControls
            assignmentName={assignmentName}
            setAssignmentName={setAssignmentName}
            addAssignment={handleSaveAssignment}
          />
        </div>
      )}

      {isEditing && (
        <AssignmentEditor
          show={isEditing}
          handleClose={() => setIsEditing(false)}
          dialogTitle="Add Assignment"
          assignmentName={assignmentName}
          setAssignmentName={setAssignmentName}
          addAssignment={handleSaveAssignment}
        />
      )}

      <ul id="wd-assignments" className="list-group rounded-0">
        {
          <li className="wd-module list-group-item p-0 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <BsGripVertical className="fs-3" />
                <h5 className="mb-0">ASSIGNMENTS</h5>
              </div>
              <div className="d-flex align-items-center gap-3">
                <h6 className="mb-0 text-muted">40% of Total</h6>
                <BsPlus className="fs-4" />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </div>
          </li>
        }
        {assignments
          .filter((assignment: any) => assignment.course === cid)
          .map((assignment: any) => (
            <li key={assignment._id} className="wd-assignment list-group-item border-gray">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex flex-row align-items-center">
                    <BsGripVertical className="fs-5 text-secondary" />
                    <LuNotebookPen className="text-success fs-5" />
                  </div>
                  <div className="d-flex flex-column">
                    <a
                      href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                      className="fw-bold text-dark text-decoration-none"
                    >
                      {assignment.title}
                    </a>
                    <div className="text-muted small">
                      <span className="text-danger">Multiple Assignments</span> |
                      <strong> Not available until </strong> {assignment.availableFrom || "Not set"} |
                      <strong> Due </strong> {assignment.dueDate || "Not set"} | {assignment.points} pts
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-row">
            <AssignmentControlButtons
              assignmentId={assignment._id}
              deleteAssignment={(assignmentId) => dispatch(deleteAssignment(assignmentId))}
            />
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}