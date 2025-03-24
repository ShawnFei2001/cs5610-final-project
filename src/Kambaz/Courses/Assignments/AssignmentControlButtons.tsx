import { FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { useSelector } from "react-redux";

export default function AssignmentControlButtons({ assignmentId, deleteAssignment }: { assignmentId: string; deleteAssignment: (assignmentId: string) => void; }) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div className="d-flex flex-row">
            {currentUser?.role === "FACULTY" && (
                <FaTrash className="text-danger me-2" onClick={() => deleteAssignment(assignmentId)} />
            )}

            <GreenCheckmark />
            <BsPlus className="fs-4" />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}