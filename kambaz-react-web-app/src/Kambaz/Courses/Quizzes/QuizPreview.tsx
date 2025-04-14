import React, { useState, useMemo, useEffect } from "react";
import { Card, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { FaRegQuestionCircle } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import { HiOutlineFlag, HiPencilAlt } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchQuizWithQuestions,
  fetchSavedAnswers,
  submitQuizAnswers,
  autosaveAnswers,
} from "./client";

// Mock data - replace with actual API calls later
// const mockQuiz = {
//   _id: "mock-quiz-1",
//   title: "Q1 - HTML",
//   description: "Quiz Instructions",
//   startedAt: "Nov 29 at 8:19am",
//   questions: [
//     {
//       _id: "q1",
//       title: "Question 1",
//       text: `An HTML <strong><u>label</u></strong> element can be associated with an HTML <strong><u>input</u></strong> element by setting their <strong><u>id</u></strong> attributes to the same value.<br/><br/>The resulting effect is that when you click on the <strong><u>label</u></strong> text, the <strong><u>input</u></strong> element receives focus as if you had click on the <strong><u>input</u></strong> element itself.`,
//       type: "True/False",
//       points: 1,
//       correctAnswer: true,
//     },
//     {
//       _id: "q2",
//       title: "Question 2",
//       text: "CSS stands for Cascading Style Sheets.",
//       type: "True/False",
//       points: 2,
//       correctAnswer: true,
//     },
//     {
//       _id: "q3",
//       title: "Question 3",
//       text: "JavaScript is a strongly typed language.",
//       type: "True/False",
//       points: 2,
//       correctAnswer: false,
//     },
//     {
//       _id: "q4",
//       title: "Question 4",
//       text: "The DOM stands for Document Object Model.",
//       type: "True/False",
//       points: 1,
//       correctAnswer: true,
//     },
//     {
//       _id: "q5",
//       title: "Question 5",
//       text: "HTTP stands for HyperText Transfer Protocol.",
//       type: "True/False",
//       points: 1,
//       correctAnswer: true,
//     }
//   ],
// };



export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  // const quiz = mockQuiz; // Replace with actual data from API
  const [quiz, setQuiz] = useState<any>(null);

useEffect(() => {
  const loadQuiz = async () => {
    const quizData = await fetchQuizWithQuestions(qid!);
    setQuiz(quizData);
  };
  loadQuiz();
}, [qid]);

useEffect(() => {
  const loadSavedAnswers = async () => {
    const saved = await fetchSavedAnswers(qid!);
    if (saved?.answers) {
      setAnswers(saved.answers);
      if (saved.savedAt) {
        setSavedTime(new Date(saved.savedAt).toLocaleTimeString());
      }
    }
  };
  loadSavedAnswers();
}, [qid]);

  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedTime, setSavedTime] = useState<string>(new Date().toLocaleTimeString());

  
  // Calculate total points
  const totalPoints = useMemo(() => 
    quiz.questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0), 
    [quiz]
  );
  
  // Count answered questions
  const answeredCount = useMemo(() => 
    Object.keys(answers).length, 
    [answers]
  );
  
  // Auto-save answers every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!submitted && Object.keys(answers).length > 0) {
        autosaveAnswers(qid!, answers);
        setSavedTime(new Date().toLocaleTimeString());
        // Here you would typically call an API to save progress
        console.log("Auto-saving quiz progress...");
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [answers, submitted]);
  
  // Handle answer changes
  const handleChange = (qid: string, answer: any) => {
    setAnswers({ ...answers, [qid]: answer });
    if (errorMessage) setErrorMessage(null);
    setSavedTime(new Date().toLocaleTimeString());
  };
  
  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Navigate to a specific question
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  // Handle quiz submission
  const handleSubmit = async () => {
    if (answeredCount < quiz.questions.length) {
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }
    
    const submit = await submitQuizAnswers(qid!, answers);
setScore(submit.score);
setSubmitted(true);
  };
  
  // Return to quiz editor
  const handleKeepEditing = () => {
    // Navigate to quiz editor page
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };
  
  // Current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (!quiz) return <div className="container mt-4">Loading quiz...</div>;

return (
  <div className="container mt-4 mb-5">
      <h2>{quiz.title}</h2>
      <Alert variant="light" className="mb-4" style={{ backgroundColor: '#F9E9E8', borderColor: '#F9DFDE', color: '#cc3232' }}>
        <div style={{ color: '#cc3232', display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #cc3232', textAlign: 'center', lineHeight: '14px', fontSize: '12px', fontWeight: 'bold' }}>!</div>
        This is a preview of the published version of the quiz
      </Alert>
      <div className="text-muted mb-2">Started: {quiz.startedAt || "N/A"}</div>
      <h3 className="mt-3 fw-bold">Quiz Instructions</h3>
      <hr />

      {!submitted ? (
        <>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center bg-light">
              <div className="fw-bold">Question {currentQuestionIndex + 1}</div>
              <div className="fw-bold">{currentQuestion?.points} pts</div>
            </Card.Header>
            <Card.Body>
              <div dangerouslySetInnerHTML={{ __html: currentQuestion?.text }} className="mb-4" />
              <Form>
                <Form.Check
                  type="radio"
                  id="true"
                  label="True"
                  name="answer"
                  checked={answers[currentQuestion._id] === true}
                  onChange={() => handleChange(currentQuestion._id, true)}
                  disabled={submitted}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="false"
                  label="False"
                  name="answer"
                  checked={answers[currentQuestion._id] === false}
                  onChange={() => handleChange(currentQuestion._id, false)}
                  disabled={submitted}
                />
              </Form>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between mb-4">
            {currentQuestionIndex > 0 && <Button variant="light" onClick={handlePrevious}>← Previous</Button>}
            {currentQuestionIndex < quiz.questions.length - 1 && <Button variant="light" onClick={handleNext}>Next →</Button>}
          </div>
        </>
      ) : (
        quiz.questions.map((q: any, index: number) => {
          const isCorrect = answers[q._id] === q.correctAnswer;
          return (
            <Card key={q._id} className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                <div className="fw-bold">Question {index + 1}</div>
                <div className="fw-bold">{q.points} pts</div>
              </Card.Header>
              <Card.Body>
                <div dangerouslySetInnerHTML={{ __html: q.text }} className="mb-4" />
                <div className="mb-2">Your Answer: <strong>{String(answers[q._id])}</strong></div>
                <Alert variant={isCorrect ? "success" : "danger"}>{isCorrect ? "Correct" : "Incorrect"}</Alert>
              </Card.Body>
            </Card>
          );
        })
      )}

      <Card className="mb-4">
        <Card.Body className="d-flex justify-content-end align-items-center gap-3">
          <div className="text-muted">Quiz saved at {savedTime}</div>
          <Button
            variant={Object.keys(answers).length >= quiz.questions.length ? "danger" : "secondary"}
            onClick={handleSubmit}
            disabled={submitted || Object.keys(answers).length < quiz.questions.length}
          >
            Submit Quiz
          </Button>
        </Card.Body>
      </Card>

      <Button
        variant="light"
        onClick={handleKeepEditing}
        className="w-100 text-start px-3 py-2 border rounded mb-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <HiPencilAlt className="me-2" style={{ fontSize: "18px" }} />
        Keep Editing This Quiz
      </Button>

      <div className="mb-4">
        <h5 className="mb-2">Questions</h5>
        <div>
          {quiz.questions.map((q: any, idx: number) => (
            <div key={q._id} className="d-flex align-items-center mb-1 ms-2">
              <FaRegQuestionCircle className="me-2 text-secondary" size={14} />
              <Button
                variant="link"
                className={`text-decoration-none text-start text-danger p-0 ${currentQuestionIndex === idx ? 'fw-bold' : ''}`}
                onClick={() => goToQuestion(idx)}
                disabled={submitted}
              >
                Question {idx + 1}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {submitted && (
        <Alert variant="success" className="mt-4">
          <h5>Quiz Results</h5>
          <p>Your Score: {score} out of {totalPoints} ({((score / totalPoints) * 100).toFixed(1)}%)</p>
        </Alert>
      )}
    </div>
  );
}


//   return (
//     <div className="container mt-4 mb-5">
//       {/* Quiz Header - Title first */}
//       <div className="mb-2 fw-bold">
//         <h2>{quiz.title}</h2>
//       </div>
      
//       {/* Preview Banner  */}
//       <Alert 
//         variant="light" 
//         className="mb-4" 
//         style={{ 
//           backgroundColor: '#F9E9E8', 
//           borderColor: '#F9DFDE',
//           color: '#cc3232',
//           padding: '12px 20px',
//           borderRadius: '4px'
//         }}
//       >
//         {/* <span style={{ color: '#cc3232', marginRight: '8px' }}>⚠</span> */}
//         <div 
//           style={{ 
//             color: '#cc3232', 
//             marginRight: '8px', 
//             display: 'inline-block',
//             width: '16px',
//             height: '16px',
//             borderRadius: '50%',
//             border: '1.5px solid #cc3232',
//             textAlign: 'center',
//             lineHeight: '14px',
//             fontSize: '12px',
//             fontWeight: 'bold'
//           }}
//         >!</div>
//         This is a preview of the published version of the quiz
//       </Alert>
      
//       {/* Quiz Started Time */}
//       <div className="mb-2">
//         <div className="text-muted">Started: {quiz.startedAt}</div>
//         <h3 className="mt-3 fw-bold">Quiz Instructions</h3>
//         <hr/>
//       </div>
      
//       {/* Current Question */}
      // <div style={{ position: 'relative', paddingLeft: '32px' }}>
      //   <div style={{
      //     position: 'absolute',
      //     top: '10px',
      //     left: '0px',
      //     width: '24px',
      //     height: '24px',
      //     display: 'flex',
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //   }}>
      //     <svg
      //       width="20"
      //       height="20"
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       stroke="#6c757d"
      //       strokeWidth="1.5"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //     >
      //       <path d="M4 4 H14 L20 12 L14 20 H4 Z" />
      //     </svg>
      //   </div>

//       <Card className="mb-4">
//         <Card.Header className="d-flex justify-content-between align-items-center bg-light">
//           <div className="d-flex align-items-center fw-bold">
//             <div>Question {currentQuestionIndex + 1}</div>
//           </div>
//           <div className="fw-bold">{currentQuestion.points} pts</div>
//         </Card.Header>
//         <Card.Body>
//           <div 
//             dangerouslySetInnerHTML={{ __html: currentQuestion.text }} 
//             className="mb-4" 
//           />
          
//           {currentQuestion.type === "True/False" && (
//             <Form>
//               <Form.Check
//                 type="radio"
//                 id={`${currentQuestion._id}-true`}
//                 label="True"
//                 name={`question-${currentQuestion._id}`}
//                 checked={answers[currentQuestion._id] === true}
//                 onChange={() => handleChange(currentQuestion._id, true)}
//                 disabled={submitted}
//                 className="mb-2"
//               />
//               <Form.Check
//                 type="radio"
//                 id={`${currentQuestion._id}-false`}
//                 label="False"
//                 name={`question-${currentQuestion._id}`}
//                 checked={answers[currentQuestion._id] === false}
//                 onChange={() => handleChange(currentQuestion._id, false)}
//                 disabled={submitted}
//               />
//             </Form>
//           )}
          
//           {submitted && (
//             <Alert variant={answers[currentQuestion._id] === currentQuestion.correctAnswer ? "success" : "danger"} className="mt-3">
//               {answers[currentQuestion._id] === currentQuestion.correctAnswer ? "Correct" : "Incorrect"}
//             </Alert>
//           )}
//         </Card.Body>
//       </Card>
//       </div>
//       {/* Navigation Buttons */}
//       <div className="d-flex justify-content-between mb-4">
//         <div style={{paddingLeft: '32px' }} >
//         {currentQuestionIndex > 0 && (
//           <Button variant="light" onClick={handlePrevious} disabled={submitted}>← Previous</Button>
//         )}
//         </div>
//         <div className="flex-fill" />
//         {currentQuestionIndex < quiz.questions.length - 1 && (
//           <Button variant="light" onClick={handleNext} disabled={submitted}>Next →</Button>
//         )}
//       </div>
      
//       {/* Quiz Footer - Save Status & Submit */}
//       <Card className="mb-4">
//         <Card.Body className="d-flex justify-content-end align-items-center gap-3">
//           <div className="text-muted">
//             Quiz saved at {savedTime}
//           </div>
//           <Button 
//             variant={answeredCount >= quiz.questions.length ? "danger" : "secondary"}
//             onClick={handleSubmit}
//             disabled={submitted || answeredCount < quiz.questions.length}
//           >
//             Submit Quiz
//           </Button>
//         </Card.Body>
//       </Card>
      
//       {/* Edit Button */}
//       <Button 
//         variant="light"
//         onClick={handleKeepEditing}
//         className="w-100 text-start px-3 py-2 border rounded mb-4"
//         style={{ backgroundColor: "#f8f9fa" }}
//       >
//         <HiPencilAlt className="me-2" style={{ fontSize: "18px" }} />
//         Keep Editing This Quiz
//       </Button>
      
    // {/* Questions Navigation */}
    // <div className="mb-4">
    //   <h5 className="mb-2">Questions</h5>
    //   <div>
    //     {quiz.questions.map((q, idx) => (
    //       <div key={q._id} className="d-flex align-items-center mb-1 ms-2">
    //         {/* Left icon (question mark in circle) */}
    //         <FaRegQuestionCircle className="me-2 text-secondary" size={14} />

    //         {/* Question Button */}
    //         <Button 
    //           variant="link"
    //           className={`text-decoration-none text-start text-danger p-0 ${currentQuestionIndex === idx ? 'fw-bold' : ''}`}
    //           onClick={() => goToQuestion(idx)}
    //           disabled={submitted}
    //         >
    //           Question {idx + 1}
    //         </Button>
    //       </div>
    //     ))}
    //   </div>
    // </div>
      
//       {/* Results (if submitted) */}
//       {submitted && (
//         <Alert variant="success" className="mt-4">
//           <h5>Quiz Results</h5>
//           <p>Your Score: {score} out of {totalPoints} ({((score / totalPoints) * 100).toFixed(1)}%)</p>
//         </Alert>
//       )}
//     </div>
//   );
// }