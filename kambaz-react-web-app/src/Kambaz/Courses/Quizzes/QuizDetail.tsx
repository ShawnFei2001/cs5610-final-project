import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiPencilAlt } from "react-icons/hi";

export default function QuizDetail() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const quiz = quizzes.find((q: any) => q._id === qid);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!quiz) return <div className="container mt-4">Quiz not found.</div>;

  return (
    <div className="container mt-4">
      {/* Faculty: Preview & Edit Buttons */}
      {currentUser?.role === "FACULTY" && (
        <div className="d-flex justify-content-center gap-2 mb-3">
          <button className="btn btn-outline-secondary bg-light">Preview</button>
          <button
            className="btn btn-light border"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
          >
            <HiPencilAlt className="me-1" />
            Edit
          </button>
        </div>
      )}

      {/* Student: Start Quiz */}
      {currentUser?.role === "STUDENT" && (
        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-primary px-4">Start Quiz</button>
        </div>
      )}
      <hr />
      <h3 className="fw-bold">{quiz.title}</h3>

      <table className="table table-borderless w-auto">
        <tbody>
          <tr><td className="fw-bold text-end">Quiz Type</td><td>Graded Quiz</td></tr>
          <tr><td className="fw-bold text-end">Points</td><td>{quiz.points}</td></tr>
          <tr><td className="fw-bold text-end">Assignment Group</td><td>QUIZZES</td></tr>
          <tr><td className="fw-bold text-end">Shuffle Answers</td><td>No</td></tr>
          <tr><td className="fw-bold text-end">Time Limit</td><td>30 Minutes</td></tr>
          <tr><td className="fw-bold text-end">Multiple Attempts</td><td>No</td></tr>
          <tr><td className="fw-bold text-end">View Responses</td><td>Always</td></tr>
          <tr><td className="fw-bold text-end">Show Correct Answers</td><td>Immediately</td></tr>
          <tr><td className="fw-bold text-end">One Question at a Time</td><td>Yes</td></tr>
          <tr><td className="fw-bold text-end">Require Respondus LockDown Browser</td><td>No</td></tr>
          <tr><td className="fw-bold text-end">Required to View Quiz Results</td><td>No</td></tr>
          <tr><td className="fw-bold text-end">Webcam Required</td><td>No</td></tr>
          <tr><td className="fw-bold text-end">Lock Questions After Answering</td><td>No</td></tr>
        </tbody>
      </table>


      <table className="table table-sm mt-4" style={{ width: "fit-content" }}>
        <thead className="border-top border-bottom">
            <tr className="text-muted">
            <th className="fw-semibold px-3 py-2">Due</th>
            <th className="fw-semibold px-3 py-2">For</th>
            <th className="fw-semibold px-3 py-2">Available from</th>
            <th className="fw-semibold px-3 py-2">Until</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td className="px-3 py-2">{quiz.dueDate ? formatDateTime(quiz.dueDate) : "N/A"}</td>
            <td className="px-3 py-2">Everyone</td>
            <td className="px-3 py-2">{quiz.availableFrom ? formatDateTime(quiz.availableFrom) : "N/A"}</td>
            <td className="px-3 py-2">{quiz.availableUntil ? formatDateTime(quiz.availableUntil) : "N/A"}</td>
            </tr>
        </tbody>
        </table>
    </div>
  );
}
