// src/Kambaz/Courses/Quizzes/QuizPreview.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import axios from "axios";

const QUIZZES_API = import.meta.env.VITE_REMOTE_SERVER_A6 || "http://localhost:4000/api";

export default function QuizPreview() {
  const { qid } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [attemptLimitReached, setAttemptLimitReached] = useState(false);
  const [quiz, setQuiz] = useState<any>({});

  useEffect(() => {
    const loadQuiz = async () => {
      const { data } = await axios.get(`${QUIZZES_API}/quizzes/${qid}`);
      setQuiz(data);
    };

    const loadQuestions = async () => {
      const { data } = await axios.get(`${QUIZZES_API}/quizzes/${qid}/questions`);
      setQuestions(data);
      const total = data.reduce((acc: number, q: any) => acc + q.points, 0);
      setTotalPoints(total);
    };

    const loadLatestAnswers = async () => {
      const { data } = await axios.get(`${QUIZZES_API}/quiz-attempts/${qid}`, { withCredentials: true });
      if (data?.answers) {
        setAnswers(data.answers);
        setSubmitted(true);
      }
    };

    const checkAttempts = async () => {
      const { data } = await axios.get(`${QUIZZES_API}/quizzes/${qid}/answers`, { withCredentials: true });
      if (data?.attemptCount >= (data.quiz?.maxAttempts || 1)) {
        setAttemptLimitReached(true);
        setSubmitted(true);
      }
    };

    loadQuiz();
    loadQuestions();
    loadLatestAnswers();
    checkAttempts();
  }, [qid]);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${QUIZZES_API}/quiz-attempts/${qid}/submit`,
        { answers },
        { withCredentials: true }
      );

      setScore(data.score);
      setResults(data.results);
      setSubmitted(true);
    } catch (e) {
      console.error("Error submitting quiz:", e);
    }
  };

  const setAnswer = (questionId: string, answer: any) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: answer });
  };

  return (
    <div className="p-4">
      <h2 className="mb-3">Quiz Preview</h2>

      {attemptLimitReached && (
        <Alert variant="danger">You have used all your allowed attempts.</Alert>
      )}

      {questions.map((question: any, idx: number) => (
        <div key={question._id} className="mb-4">
          <h5>
            Q{idx + 1}: {question.title} ({question.points} pts)
          </h5>
          <p>{question.text}</p>
          {question.type === "Multiple Choice" && (
            <Form>
              {question.choices.map((choice: string, i: number) => {
                const isCorrect = results[question._id] && answers[question._id] === question.correctAnswer;
                const isWrong = results[question._id] === false && answers[question._id] === choice;
                return (
                  <Form.Check
                    key={i}
                    type="radio"
                    label={choice}
                    name={`q-${question._id}`}
                    value={choice}
                    checked={answers[question._id] === choice}
                    disabled={submitted}
                    onChange={() => setAnswer(question._id, choice)}
                    className={
                      submitted
                        ? isCorrect
                          ? "text-success fw-bold"
                          : isWrong
                          ? "text-danger fw-bold"
                          : ""
                        : ""
                    }
                  />
                );
              })}
            </Form>
          )}
        </div>
      ))}

      {!submitted && !attemptLimitReached && (
        <Button onClick={handleSubmit} className="mt-3">
          Submit Quiz
        </Button>
      )}

      {submitted && (
        <Alert variant="info" className="mt-3">
          Score: {score} / {totalPoints}
        </Alert>
      )}
    </div>
  );
}