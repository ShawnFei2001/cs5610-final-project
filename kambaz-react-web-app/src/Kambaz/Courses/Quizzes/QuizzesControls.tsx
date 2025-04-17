import { FaPlus } from "react-icons/fa6";
import { Button, FormControl, Dropdown } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { deleteQuiz } from "./reducer";
import { FaBan } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import QuizMenu from "./QuizMenu";



export default function QuizzesControls() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid } = useParams();
  const [isPublished, setIsPublished] = useState(false);

  const handleCreateAndNavigate = () => {
    const newQuizId = Date.now().toString();
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuizId}/edit`);
  };


  return (
    <div className="d-flex align-items-center justify-content-between">
      <FormControl className="w-50 me-3" placeholder="Search for Quiz" />

      {currentUser?.role === "FACULTY" && (
        <div className="d-flex gap-2">
          {/* + Quiz */}
          <Button
            variant="danger"
            size="sm"
            onClick={handleCreateAndNavigate}
            className="d-flex align-items-center px-2 py-1"
          >
            <FaPlus className="me-2 fs-6" />
            Quiz
          </Button>

          {/* Dropdown 3-dot menu */}
          <QuizMenu />
        </div>
      )}
    </div>
  );
}
