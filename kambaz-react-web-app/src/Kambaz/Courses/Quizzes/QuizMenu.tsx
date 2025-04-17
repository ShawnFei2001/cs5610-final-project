import { Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deleteQuiz } from "./reducer";
import { FaBan } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

export default function QuizMenu({ quizId }: { quizId?: string }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const [isPublished, setIsPublished] = useState(false);

  const handleDelete = () => {
    if (quizId) {
      dispatch(deleteQuiz(quizId));
    } else if (quizzes.length > 0) {
      const lastId = quizzes[quizzes.length - 1]._id;
      dispatch(deleteQuiz(lastId));
    }
  };

  const handleEdit = () => {
    if (quizId) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
    } else if (quizzes.length > 0) {
      const lastId = quizzes[quizzes.length - 1]._id;
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${lastId}`);
    }
  };

  const handleCopy = () => {
    let quizToCopy;
    if (quizId) {
      quizToCopy = quizzes.find((q: any) => q._id === quizId);
    } else if (quizzes.length > 0) {
      quizToCopy = quizzes[quizzes.length - 1];
    }
    if (!quizToCopy) return;
    const copied = {
      ...quizToCopy,
      _id: Date.now().toString(),
      title: `${quizToCopy.title} (Copy)`
    };
    dispatch({ type: "quizzes/addQuiz", payload: copied });
  };

  const handleSort = () => {
    const sorted = [...quizzes].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateA - dateB;
    });
    dispatch({ type: "quizzes/setQuizzes", payload: sorted });
  };
  const handleTogglePublish = () => {
    if (!quizId) return;
    const updated = quizzes.map((q: any) =>
        q._id === quizId ? { ...q, published: !q.published } : q
    );
    dispatch({ type: "quizzes/setQuizzes", payload: updated });
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="secondary" size="sm" className="px-2 py-1">
        ⋮
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleEdit}>✏️ Edit Quiz</Dropdown.Item>
        <Dropdown.Item onClick={handleDelete}>🗑️ Delete Quiz</Dropdown.Item>
        <Dropdown.Item onClick={handleTogglePublish}>
          {isPublished ? (
            <span>
              <FaBan className="me-2 text-danger" />
              Unpublish
            </span>
          ) : (
            <span>
              <FaCheckCircle className="me-2 text-success" />
              Publish
            </span>
          )}
        </Dropdown.Item>
        <Dropdown.Item onClick={handleCopy}>
        📋 Copy
        </Dropdown.Item>
        <Dropdown.Item onClick={handleSort}>
        🔃 Sort
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
