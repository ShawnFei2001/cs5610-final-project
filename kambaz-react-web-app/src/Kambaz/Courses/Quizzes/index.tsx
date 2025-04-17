import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { setQuizzes, deleteQuiz as deleteQuizAction } from "./reducer";
import QuizzesControls from "./QuizzesControls";
import QuizControlButtons from "./QuizControlButtons";
import { GoTriangleDown } from "react-icons/go";
import { IoRocketOutline } from "react-icons/io5";
import * as quizzesClient from "./client";

export default function Quizzes() {
  console.log("🧩 Quizzes component mounted"); 
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const dispatch = useDispatch();

  // Use optional chaining to handle missing quizzesReducer
  const quizzesState = useSelector((state: any) => state.quizzesReducer);
  const quizzes = quizzesState?.quizzes || [];

  // Local state as fallback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!cid) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching quizzes for course:", cid);
        const quizzesForCourse = await quizzesClient.findQuizzesForCourse(cid);
        console.log("Quizzes fetched:", quizzesForCourse);
        dispatch(setQuizzes(quizzesForCourse || []));
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching quizzes:", error);
        setError(error.message);
        dispatch(setQuizzes([]));
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [cid, dispatch]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
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

      {loading ? (
        <div className="text-center p-4">Loading quizzes...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
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

            {quizzes.length === 0 ? (
              <li className="list-group-item text-center p-3">
                No quizzes available for this course.
              </li>
            ) : (
              quizzes.map((quiz: any) => {
                const now = new Date();
                const availableFrom = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
                const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

                let availabilityText = "Availability Unknown";
                if (availableFrom && now < availableFrom) {
                  availabilityText = `Not available until ${formatDateTime(quiz.availableFrom)}`;
                } else if (availableUntil && now > availableUntil) {
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
                          
                            href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                            className="fw-bold text-dark text-decoration-none"
                          <a>
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
                            | <strong>{quiz.points || 0} pts</strong> |{" "}
                            <strong>{quiz.questions || 0} Questions</strong>
                            {currentUser?.role === "STUDENT" && quiz.score !== undefined && (
                                <> | <strong>Score:</strong> {quiz.score}%</>
                            )}
                          </div>
                        </div>
                      </div>
                      <QuizControlButtons quizId={quiz._id} />
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </>
      )}
    </div>
  );
}