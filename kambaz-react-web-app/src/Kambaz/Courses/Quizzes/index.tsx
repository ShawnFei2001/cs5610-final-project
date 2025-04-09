import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import {
  setQuizzes,
  deleteQuiz as deleteQuizAction,
} from "./reducer";
import QuizzesControls from "./QuizzesControls";
import QuizControlButtons from "./QuizControlButtons";
import { GoTriangleDown } from "react-icons/go";
import { IoRocketOutline } from "react-icons/io5";

// mock quiz 数据
const mockQuizzes = [
  {
    _id: "1",
    title: "Q1 - HTML",
    points: 29,
    dueDate: "2025-04-15T13:00:00",
    availableFrom: "2025-04-10T09:00:00",
    availableUntil: "2025-04-15T23:59:59",
    course: "1234",
    questions: 10,
    score: 85,
  },
  {
    _id: "2",
    title: "Q2 - CSS",
    points: 30,
    dueDate: "2025-04-20T14:30:00",
    availableFrom: "2025-04-01T15:00:00",
    availableUntil: "2025-04-20T23:59:59",
    course: "1234",
    questions: 8,
    score: 92,
  },
  {
    _id: "3",
    title: "Q3 - JAVA",
    points: 30,
    dueDate: "2023-04-20T14:30:00",
    availableFrom: "2021-04-01T15:00:00",
    availableUntil: "2023-04-20T23:59:59",
    course: "1234",
    questions: 8,
    score: 92,
  },
];

export default function Quizzes() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid: paramCid } = useParams();
  const cid = paramCid || "cs5610-sp25";
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  useEffect(() => {
    const filtered = mockQuizzes.filter((q) => q.course === cid);
    dispatch(setQuizzes(filtered));
  }, [cid, dispatch]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const datePart = formatDate(dateStr);
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} at ${timePart.toLowerCase()}`;
  };

  return (
    <div className="d-flex flex-column">
      {currentUser?.role === "FACULTY" && (
        <div className="mb-4">
          <QuizzesControls />
        </div>
      )}

      <hr />
      <ul className="list-group rounded-0">
        <li className="list-group-item p-0 border-gray">
          <div className="p-3 ps-2 bg-light d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <GoTriangleDown className="fs-3" />
              <h6 className="mb-0 fw-bold">Assignment Quizzes</h6>
            </div>
          </div>
        </li>

        {quizzes
          .filter((quiz: any) => quiz.course === cid)
          .map((quiz: any) => {
            const now = new Date();
            const availableFrom = new Date(quiz.availableFrom);
            const availableUntil = new Date(quiz.availableUntil);

            let availabilityText = "Availability Unknown";
            if (now < availableFrom) {
              availabilityText = `Not available until ${formatDateTime(quiz.availableFrom)}`;
            } else if (now > availableUntil) {
              availabilityText = "Closed";
            } else {
              availabilityText = "Available";
            }

            return (
              <li key={quiz._id} className="list-group-item border-gray">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <IoRocketOutline className="text-success fs-5" />
                    <div className="d-flex flex-column">
                      <a
                        href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                        className="fw-bold text-dark text-decoration-none"
                      >
                        {quiz.title}
                      </a>
                      <div className="text-muted small">
                        {availabilityText.startsWith("Not available until") ? (
                            <>
                            <strong>Not available until</strong>{" "}
                            <span className="text-danger">
                                {formatDateTime(quiz.availableFrom)}
                            </span>{" "}
                            | <strong>Due</strong>{" "}
                            <span className="text-danger">
                                {quiz.dueDate ? formatDateTime(quiz.dueDate) : "N/A"}
                            </span>
                            </>
                        ) : availabilityText === "Closed" ? (
                            <>
                            <strong>Closed</strong> | <strong>Due</strong>{" "}
                            <span className="text-danger">
                                {quiz.dueDate ? formatDateTime(quiz.dueDate) : "N/A"}
                            </span>
                            </>
                        ) : (
                            <>
                            <strong>Available</strong>{" "}
                            <span className="text-danger">
                                {quiz.availableFrom ? formatDateTime(quiz.availableFrom) : "N/A"}
                            </span>{" "}
                            | <strong>Due</strong>{" "}
                            <span className="text-danger">
                                {quiz.dueDate ? formatDateTime(quiz.dueDate) : "N/A"}
                            </span>
                            </>
                        )}{" "}
                        | <strong>{quiz.points} pts</strong> |{" "}
                        <strong>{quiz.questions} Questions</strong>
                        {currentUser?.role === "STUDENT" && (
                            <> | <strong>Score:</strong> {quiz.score}%</>
                        )}
                        </div>
                    </div>
                  </div>
                  <QuizControlButtons quizId={quiz._id} />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
