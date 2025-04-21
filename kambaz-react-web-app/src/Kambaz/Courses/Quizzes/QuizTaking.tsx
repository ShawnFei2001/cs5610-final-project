// // src/Kambaz/Courses/Quizzes/QuizPreview.tsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Alert, Button, Form } from "react-bootstrap";
// import axios from "axios";

// const QUIZZES_API =
//   import.meta.env.VITE_REMOTE_SERVER_A6 || "http://localhost:4000/api";

// export default function QuizTaking() {
//   const { qid } = useParams();
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [answers, setAnswers] = useState<{ [key: string]: any }>({});
//   const [results, setResults] = useState<{ [key: string]: boolean }>({});
//   const [score, setScore] = useState<number | null>(null);
//   const [totalPoints, setTotalPoints] = useState<number>(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [attemptLimitReached, setAttemptLimitReached] = useState(false);
//   const [quiz, setQuiz] = useState<any>({});

//   useEffect(() => {
//     const loadQuiz = async () => {
//       const { data } = await axios.get(`${QUIZZES_API}/quizzes/${qid}`);
//       setQuiz(data);
//     };

//     const loadQuestions = async () => {
//       const { data } = await axios.get(
//         `${QUIZZES_API}/quizzes/${qid}/questions`
//       );
//       setQuestions(data);
//       const total = data.reduce((acc: number, q: any) => acc + q.points, 0);
//       setTotalPoints(total);
//     };

//     const loadLatestAnswers = async () => {
//       const { data } = await axios.get(`${QUIZZES_API}/quiz-attempts/${qid}`, {
//         withCredentials: true,
//       });
//       // if (data?.answers) {
//       //   setAnswers(data.answers);
//       //   setSubmitted(true);
//       // }
//       if (data?.score !== undefined && data.answers?.length > 0) {
//         setAnswers(data.answers);
//         setSubmitted(true);
//         setScore(data.score);
//         setResults(data.results);
//       }
//     };

//     const checkAttempts = async () => {
//       const { data } = await axios.get(
//         `${QUIZZES_API}/quizzes/${qid}/answers`,
//         { withCredentials: true }
//       );
//       if (data?.attemptCount >= (data.quiz?.maxAttempts || 1)) {
//         setAttemptLimitReached(true);
//         setSubmitted(true);
//       }
//     };

//     loadQuiz();
//     loadQuestions();
//     loadLatestAnswers();
//     checkAttempts();
//   }, [qid]);

//   const handleSubmit = async () => {
//     console.log("🚀 Submit clicked");
//     console.log(">>> QUIZZES_API:", QUIZZES_API);
//     console.log(">>> qid:", qid);
//     console.log(">>> answers:", answers);
//     try {
//       const { data } = await axios.post(
//         `${QUIZZES_API}/quiz-attempts/${qid}/submit`,
//         { answers },
//         { withCredentials: true }
//       );
//       console.log("✅ Submit response:", data);

//       setScore(data.score);
//       setResults(data.results);
//       setSubmitted(true);
//     } catch (e) {
//       console.error("Error submitting quiz:", e);
//     }
//   };

//   const setAnswer = (questionId: string, answer: any) => {
//     if (submitted) return;
//     setAnswers({ ...answers, [questionId]: answer });
//   };

//   console.log("🔍 Entered return block of QuizPreview");
//   return (
//     <div className="p-4">
//       <h2 className="mb-3">Quiz Taking</h2>

//       {attemptLimitReached && (
//         <Alert variant="danger">You have used all your allowed attempts.</Alert>
//       )}

//       {questions.map((question: any, idx: number) => (
//         <div key={question._id} className="mb-4">
//           <h5>
//             Q{idx + 1}: {question.title} ({question.points} pts)
//           </h5>
//           <p>{question.text}</p>
//           {question.type === "Multiple Choice" && (
//             <Form>
//               {question.choices.map((choice: string, i: number) => {
//                 const isCorrect =
//                   results[question._id] &&
//                   answers[question._id] === question.correctAnswer;
//                 const isWrong =
//                   results[question._id] === false &&
//                   answers[question._id] === choice;
//                 return (
//                   <Form.Check
//                     key={i}
//                     type="radio"
//                     label={choice}
//                     name={`q-${question._id}`}
//                     value={choice}
//                     checked={answers[question._id] === choice}
//                     disabled={submitted}
//                     onChange={() => setAnswer(question._id, choice)}
//                     className={
//                       submitted
//                         ? isCorrect
//                           ? "text-success fw-bold"
//                           : isWrong
//                           ? "text-danger fw-bold"
//                           : ""
//                         : ""
//                     }
//                   />
//                 );
//               })}
//             </Form>
//           )}
//         </div>
//       ))}

//       {/* {!submitted && !attemptLimitReached && (
//         <Button onClick={handleSubmit} className="mt-3">
//           Submit Quiz
//         </Button>
//       )} */}
//       {(() => {
//         console.log(
//           "Rendering submit button, submitted:",
//           submitted,
//           ", attemptLimitReached:",
//           attemptLimitReached
//         );
//         return (
//           !submitted &&
//           !attemptLimitReached && (
//             <Button onClick={handleSubmit} className="mt-3">
//               Submit Quiz
//             </Button>
//           )
//         );
//       })()}

//       {submitted && (
//         <Alert variant="info" className="mt-3">
//           Score: {score} / {totalPoints}
//         </Alert>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form } from "react-bootstrap";
import axios from "axios";

const QUIZZES_API =
  import.meta.env.VITE_REMOTE_SERVER_A6 || "http://localhost:4000/api";

const normalizeAnswers = (raw: any): { [key: string]: any } => {
  if (Array.isArray(raw)) {
    const obj: { [key: string]: any } = {};
    raw.forEach((ans: any) => {
      obj[ans.questionId] = ans.answer;
    });
    return obj;
  } else if (raw && typeof raw === "object") {
    return raw;
  } else {
    return {};
  }
};

export default function QuizTaking() {
  const { qid } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(1);
  const [lockedOut, setLockedOut] = useState(false);
  const [attemptDate, setAttemptDate] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const questionRes = await axios.get(
        `${QUIZZES_API}/quizzes/${qid}/questions`
      );
      const questionList = questionRes.data;
      setQuestions(questionList);

      const total = questionList.reduce(
        (acc: number, q: any) => acc + q.points,
        0
      );
      setTotalPoints(total);

      const { data } = await axios.get(
        `${QUIZZES_API}/quizzes/${qid}/answers`,
        {
          withCredentials: true,
        }
      );

      const last = data.lastAttempt || {};

      setAttemptCount(data.attemptCount || 0);
      setMaxAttempts(data.quiz?.maxAttempts || 1);

      if (data.attemptCount >= (data.quiz?.maxAttempts || 1)) {
        setLockedOut(true);
      }

      if (Array.isArray(last.answers) && last.answers.length > 0) {
        const normalized = normalizeAnswers(last.answers);
        setAnswers(normalized);
        setScore(last.score || 0);
        setAttemptDate(
          last.attemptDate || last.attemptDate || last.submittedAt || null
        );
        setSubmitted(true);

        const computedResults: { [key: string]: boolean } = {};
        questionList.forEach((q: any) => {
          const a = normalized[q._id];
          computedResults[q._id] =
            JSON.stringify(String(a)) ===
            JSON.stringify(String(q.correctAnswer));
        });
        setResults(computedResults);
      }
    };

    loadData();
  }, [qid]);

  const handleSubmit = async () => {
    if (lockedOut) return;
    try {
      const { data } = await axios.post(
        `${QUIZZES_API}/quiz-attempts/${qid}/submit`,
        { answers },
        { withCredentials: true }
      );
      setScore(data.score);
      setResults(data.results);
      setSubmitted(true);
      setAttemptDate(data.attemptDate || new Date().toISOString());
      setAttemptCount((prev) => prev + 1);
      if (attemptCount + 1 >= maxAttempts) {
        setLockedOut(true);
      }
    } catch (e) {
      console.error("Error submitting quiz:", e);
    }
  };

  const setAnswer = (questionId: string, answer: any) => {
    if (submitted || lockedOut) return;
    setAnswers({ ...answers, [questionId]: answer });
  };

  const renderSubmittedView = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {lockedOut && (
          <Alert variant="danger" className="mb-0">
            You have reached the maximum number of attempts for this quiz.
          </Alert>
        )}
        {!lockedOut && (
          <Button
            variant="primary"
            onClick={() => {
              setAnswers({});
              setResults({});
              setSubmitted(false);
              setCurrentQuestionIndex(0);
            }}
          >
            {/* Retake Quiz (Attempt {attemptCount + 1} / {maxAttempts}) */}
            Retake Quiz
          </Button>
        )}
      </div>
      <h4 className="mb-3">Quiz Results</h4>
      {attemptDate && (
        <p className="text-muted mb-3">
          Last Attempt: {new Date(attemptDate).toLocaleString()}
        </p>
      )}
      {questions.map((question, idx) => {
        const userAnswer = answers[question._id];
        const isCorrect = results[question._id];

        return (
          <Card className="mb-3" key={question._id}>
            <Card.Header>
              <strong>Question {idx + 1}</strong> ({question.points} pts)
            </Card.Header>
            <Card.Body>
              <div
                dangerouslySetInnerHTML={{ __html: question.text }}
                className="mb-2"
              />
              <div>
                <strong>Your Answer:</strong>{" "}
                {userAnswer !== undefined ? String(userAnswer) : "No Answer"}
              </div>
              <Alert
                variant={isCorrect ? "success" : "danger"}
                className="mt-2"
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </Alert>
            </Card.Body>
          </Card>
        );
      })}
      <Alert variant="info">
        Final Score: {score} / {totalPoints} (
        {Math.round((score! / totalPoints) * 100)}%)
      </Alert>
    </div>
  );

  const currentQuestion = questions[currentQuestionIndex];

  if (lockedOut && !submitted) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          You have used all your allowed attempts. You cannot take this quiz
          again.
        </Alert>
        {renderSubmittedView()}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Quiz Taking</h2>

      {submitted ? (
        renderSubmittedView()
      ) : (
        <>
          <div className="mb-3">
            <h5>Questions</h5>
            {questions.map((q, idx) => (
              <div
                key={q._id}
                style={{ cursor: "pointer" }}
                className={
                  idx === currentQuestionIndex
                    ? "fw-bold text-primary"
                    : "text-danger"
                }
                onClick={() => setCurrentQuestionIndex(idx)}
              >
                ❓ Question {idx + 1}
              </div>
            ))}
          </div>

          {currentQuestion && (
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>{currentQuestion.points} pts</span>
              </Card.Header>
              <Card.Body>
                <div
                  dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                  className="mb-3"
                />
                {currentQuestion.type === "Multiple Choice" && (
                  <Form>
                    {currentQuestion.choices.map(
                      (choice: string, i: number) => (
                        <Form.Check
                          key={i}
                          type="radio"
                          label={choice}
                          name={`q-${currentQuestion._id}`}
                          value={choice}
                          checked={answers[currentQuestion._id] === choice}
                          onChange={() =>
                            setAnswer(currentQuestion._id, choice)
                          }
                        />
                      )
                    )}
                  </Form>
                )}

                {currentQuestion.type === "Fill in the Blank" && (
                  <Form.Control
                    type="text"
                    placeholder="Type your answer here"
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) =>
                      setAnswer(currentQuestion._id, e.target.value)
                    }
                  />
                )}

                {currentQuestion.type === "True/False" && (
                  <Form>
                    {[true, false].map((val) => (
                      <Form.Check
                        key={String(val)}
                        type="radio"
                        label={String(val)}
                        name={`q-${currentQuestion._id}`}
                        value={String(val)}
                        checked={
                          String(answers[currentQuestion._id]) === String(val)
                        }
                        onChange={() => setAnswer(currentQuestion._id, val)}
                      />
                    ))}
                  </Form>
                )}
              </Card.Body>
            </Card>
          )}

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              ← Back
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next →
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="primary">
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
