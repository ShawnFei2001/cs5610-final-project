import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Tabs,
  Tab,
  Form,
  Button,
  FormControl,
  Col,
  Row,
  Card,
  InputGroup,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updateQuiz, addQuiz } from "./reducer";
import * as quizzesClient from "./client";
import { Editor } from "@tinymce/tinymce-react";
import { GoX } from "react-icons/go";
import { FaBan } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import QuestionEditor from "./QuestionEditor";
import { addQuestion, updateQuestion, deleteQuestion } from "./reducer";
import { questions as mockQuestions } from "../../Database";

interface QuizType {
  _id: string;
  title: string;
  description: string;
  points: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  course: string;
  // published?: boolean;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  showCorrectAnswers: boolean;
  accessCode?: string;
  hasTimeLimit: boolean;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  viewResponse: boolean;
  requireLockdownBrowser: boolean;
  requiredToViewResults: boolean;
}

export default function QuizEditor() {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const existingQuiz = quizzes.find((q: any) => q._id === qid);
  const editorRef = useRef<any>(null);

  const [key, setKey] = useState("details");
  const [editedQuiz, setEditedQuiz] = useState<QuizType>({
    _id: existingQuiz?._id || qid || "",
    title: existingQuiz?.title || "",
    description: existingQuiz?.description || "",
    points: existingQuiz?.points || 10,
    dueDate: existingQuiz?.dueDate || "",
    availableFrom: existingQuiz?.availableFrom || "",
    availableUntil: existingQuiz?.availableUntil || "",
    course: existingQuiz?.course || cid || "",
    // published: existingQuiz?.published || false,
    quizType: existingQuiz?.quizType || "Graded Quiz",
    assignmentGroup: existingQuiz?.assignmentGroup || "Quizzes",
    shuffleAnswers: existingQuiz?.shuffleAnswers ?? true,
    timeLimit: existingQuiz?.timeLimit || 20,
    multipleAttempts: existingQuiz?.multipleAttempts ?? false,
    showCorrectAnswers: existingQuiz?.showCorrectAnswers ?? true,
    accessCode: existingQuiz?.accessCode || "",
    hasTimeLimit: existingQuiz?.hasTimeLimit ?? true,
    oneQuestionAtATime: existingQuiz?.oneQuestionAtATime ?? true,
    webcamRequired: existingQuiz?.webcamRequired ?? false,
    lockQuestionsAfterAnswering:
      existingQuiz?.lockQuestionsAfterAnswering ?? false,
    viewResponse: existingQuiz?.viewResponse ?? false,
    requireLockdownBrowser: existingQuiz?.requireLockdownBrowser ?? false,
    requiredToViewResults: existingQuiz?.requiredToViewResults ?? false,
  });

  const handleSave = () => {
    const isExistingQuiz = quizzes.some((q: any) => q._id === editedQuiz._id);
    if (isExistingQuiz) {
      quizzesClient.updateQuiz(editedQuiz);
      dispatch(updateQuiz(editedQuiz));
    } else {
      quizzesClient.addQuiz(editedQuiz);
      dispatch(addQuiz(editedQuiz));
    }
    navigate(`/Kambaz/Courses/${editedQuiz.course}/Quizzes/${editedQuiz._id}`);
  };

  const handleSaveAndPublish = () => {
    const quizToSave = { ...editedQuiz, published: true };
    const isExistingQuiz = quizzes.some((q: any) => q._id === editedQuiz._id);
    if (isExistingQuiz) {
      quizzesClient.updateQuiz(editedQuiz);
      dispatch(updateQuiz(quizToSave));
    } else {
      quizzesClient.addQuiz(editedQuiz);
      dispatch(addQuiz(quizToSave));
    }
    navigate(`/Kambaz/Courses/${editedQuiz.course}/Quizzes`);
  };

  const [questions, setQuestions] = useState<any[]>(() => {
    if (!existingQuiz?._id) return [];
    return mockQuestions.filter((q) => q.quiz === existingQuiz._id);
  });

  const [newQuestion, setNewQuestion] = useState<any | null>(null);

  const handleAddQuestion = () => {
    setNewQuestion({
      _id: Date.now().toString(),
      title: "",
      points: 1,
      text: "",
      correctAnswer: true,
      isEditing: true,
      type: "Multiple Choice",
    });
  };

  const handleQuestionChange = (questionId: string, updatedQuestion: any) => {
    const updatedQuestions = questions.map((q) =>
      q._id === questionId ? updatedQuestion : q
    );
    setQuestions(updatedQuestions);
  };

  const handleCancelQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].isEditing = false;
    setQuestions(updatedQuestions);
  };

  const handleSaveQuestion = async (question: any) => {
    try {
      let savedQuestion = question;
      if (!question._id) {
        savedQuestion = {
          ...question,
          _id: Date.now().toString(),
        };
        dispatch(addQuestion(savedQuestion));
      } else {
        dispatch(updateQuestion(savedQuestion));
      }

      const updatedQuestions = questions.map((q) =>
        q._id === savedQuestion._id ? { ...savedQuestion, isEditing: false } : q
      );
      setQuestions(updatedQuestions);

      console.log("Question saved locally ✅", savedQuestion);
    } catch (error) {
      console.error("Failed to save question", error);
    }
  };

  const handleEditQuestion = (questionId: string) => {
    const updatedQuestions = questions.map((q) =>
      q._id === questionId ? { ...q, isEditing: true } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter((q) => q._id !== questionId);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="quiz-editor mt-4">
      <div
        className="d-flex justify-content-end align-items-center mb-3"
        style={{ gap: "16px" }}
      >
        <div>Points {editedQuiz.points}</div>
        <div
          className="text-muted d-flex align-items-center"
          style={{ gap: "4px" }}
        >
          <FaBan />
          <span>Not Published</span>
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          style={{
            backgroundColor: "rgb(240, 240, 240)",
            borderRadius: "6px",
            padding: "6px 4px",
            display: "flex",
            alignItems: "center",
            border: "1px solid rgb(200, 200, 200)",
          }}
        >
          <HiDotsVertical />
        </Button>
      </div>

      <hr />
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k || "details")}
        className="mb-3"
      >
        <Tab eventKey="details" title="Details">
          <Form id="wd-quizzes-editor" className="p-4">
            {/* Title */}
            <Form.Group className="mb-3">
              <FormControl
                value={editedQuiz.title}
                onChange={(e) =>
                  setEditedQuiz({ ...editedQuiz, title: e.target.value })
                }
                style={{ width: "500px" }}
              />
            </Form.Group>

            {/* Instructions */}
            <Form.Group className="mb-3">
              <Form.Label>Quiz Instructions:</Form.Label>
              <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                init={{
                  base_url: "/tinymce",
                  height: 300,
                  menubar: "file edit view insert format tools table help",
                  plugins:
                    "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount codesample",
                  toolbar:
                    "undo redo | blocks | bold italic underline strikethrough | " +
                    "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | removeformat | help | table codesample fullscreen",
                  statusbar: true,
                  branding: false,
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                onEditorChange={(content) =>
                  setEditedQuiz({ ...editedQuiz, description: content })
                }
              />
            </Form.Group>

            {/* Quiz Type */}
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label column sm={3} className="text-end">
                Quiz Type
              </Form.Label>
              <Col sm={9}>
                <Form.Select
                  value={editedQuiz.quizType}
                  onChange={(e) =>
                    setEditedQuiz({ ...editedQuiz, quizType: e.target.value })
                  }
                >
                  <option>Graded Quiz</option>
                  <option>Ungraded Quiz</option>
                </Form.Select>
              </Col>
            </Form.Group>

            {/* Assignment Group */}
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3} className="text-end">
                Assignment Group
              </Form.Label>

              <Col sm={9}>
                <Form.Group className="mb-3 position-relative">
                  <Form.Select
                    value={editedQuiz.assignmentGroup}
                    onChange={(e) =>
                      setEditedQuiz({
                        ...editedQuiz,
                        assignmentGroup: e.target.value,
                      })
                    }
                  >
                    <option>QUIZZES</option>
                    <option>ASSIGNMENTS</option>
                  </Form.Select>
                </Form.Group>
                {/* Options */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Options</strong>
                  </Form.Label>
                  <Form.Group className="mb-3 align-items-center">
                    <Form.Check
                      label="Shuffle Answers"
                      className="mt-2"
                      checked={editedQuiz.shuffleAnswers}
                      onChange={(e) =>
                        setEditedQuiz({
                          ...editedQuiz,
                          shuffleAnswers: e.target.checked,
                        })
                      }
                    />
                    <Form.Check
                      label="One Question at a Time"
                      className="mt-2"
                      checked={editedQuiz.oneQuestionAtATime}
                      onChange={(e) =>
                        setEditedQuiz({
                          ...editedQuiz,
                          oneQuestionAtATime: e.target.checked,
                        })
                      }
                    />
                    <Form.Check
                      label="Webcam Required"
                      className="mt-2"
                      checked={editedQuiz.webcamRequired}
                      onChange={(e) =>
                        setEditedQuiz({
                          ...editedQuiz,
                          webcamRequired: e.target.checked,
                        })
                      }
                    />
                    <Form.Check
                      label="Lock Questions After Answering"
                      className="mt-2"
                      checked={editedQuiz.lockQuestionsAfterAnswering}
                      onChange={(e) =>
                        setEditedQuiz({
                          ...editedQuiz,
                          lockQuestionsAfterAnswering: e.target.checked,
                        })
                      }
                    />
                    <Form.Check
                      label="View Responses"
                      className="mt-2"
                      checked={editedQuiz.viewResponse}
                      onChange={(e) =>
                        setEditedQuiz({
                          ...editedQuiz,
                          viewResponse: e.target.checked,
                        })
                      }
                    />
                    <Form.Check
                      label="Require Lockdown Browser"
                      className="mt-2"
                      checked={editedQuiz.requireLockdownBrowser}
                      onChange={(e) =>
                        setEditedQuiz({
                          ...editedQuiz,
                          requireLockdownBrowser: e.target.checked,
                        })
                      }
                    />
                    <Form.Check
                      label="Required to View Quiz Results"
                      className="mt-2"
                      checked={editedQuiz.requiredToViewResults}
                      onChange={(e) =>
                        setEditedQuiz({
                          ...editedQuiz,
                          requiredToViewResults: e.target.checked,
                        })
                      }
                    />

                    {/* Time Limit */}
                    <div className="d-flex align-items-center mt-2">
                      <Form.Check
                        label="Time Limit"
                        className="me-5"
                        checked={editedQuiz.hasTimeLimit}
                        onChange={(e) =>
                          setEditedQuiz({
                            ...editedQuiz,
                            hasTimeLimit: e.target.checked,
                          })
                        }
                      />
                      <Form.Control
                        type="number"
                        value={editedQuiz.timeLimit}
                        onChange={(e) =>
                          setEditedQuiz({
                            ...editedQuiz,
                            timeLimit: Number(e.target.value),
                          })
                        }
                        className="me-1"
                        style={{ width: "100px" }}
                        min={1}
                        disabled={!editedQuiz.hasTimeLimit}
                      />
                      Minutes
                    </div>
                    <div className="border rounded p-2 mt-2">
                      <Form.Check
                        label="Allow Multiple Attempts"
                        checked={editedQuiz.multipleAttempts}
                        onChange={(e) =>
                          setEditedQuiz({
                            ...editedQuiz,
                            multipleAttempts: e.target.checked,
                          })
                        }
                      />
                    </div>
                  </Form.Group>
                </Form.Group>
              </Col>
            </Form.Group>

            {/* Assign to */}
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3} className="text-end">
                Assign
              </Form.Label>

              <Col sm={9}>
                <Card className="p-3" style={{ width: "500px" }}>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label>
                      <strong>Assign to</strong>
                    </Form.Label>
                    <div className="assign-input-wrapper">
                      <text className="assign-badge">
                        Everyone
                        <GoX className="assign-close-icon ms-3" />
                      </text>
                      <Form.Control type="text" className="assign-input" />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Due</strong>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="datetime-local"
                        className="custom-date-input"
                        value={editedQuiz.dueDate}
                        onChange={(e) =>
                          setEditedQuiz({
                            ...editedQuiz,
                            dueDate: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Col>
                      <Form.Label>
                        <strong>Available from</strong>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="datetime-local"
                          className="custom-date-input"
                          value={editedQuiz.availableFrom}
                          onChange={(e) =>
                            setEditedQuiz({
                              ...editedQuiz,
                              availableFrom: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Col>

                    <Col>
                      <Form.Label>
                        <strong>Until</strong>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="datetime-local"
                          className="custom-date-input"
                          value={editedQuiz.availableUntil}
                          onChange={(e) =>
                            setEditedQuiz({
                              ...editedQuiz,
                              availableUntil: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Col>
                  </Form.Group>
                  <div className="assign-add-section text-center">+ Add</div>
                </Card>
              </Col>
            </Form.Group>

            <hr
              style={{
                width: "30%",
                margin: "10px auto",
                borderTop: "1px solid #333",
              }}
            />
            <div className="d-flex justify-content-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  navigate(`/Kambaz/Courses/${editedQuiz.course}/Quizzes`);
                }}
              >
                Cancel
              </Button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleSave()}
              >
                Save
              </button>
              <Button variant="primary" onClick={() => handleSaveAndPublish()}>
                Save and Publish
              </Button>
            </div>
            <hr
              style={{
                width: "30%",
                margin: "10px auto",
                borderTop: "1px solid #333",
              }}
            />
          </Form>
        </Tab>

        {/* Questions tab placeholder */}
        <Tab eventKey="questions" title="Questions">
          <div className="p-3">
            {/* Questions List UI */}
            <div className="mb-3">
              <ul className="list-group">
                {questions.map((question) => (
                  <li
                    key={question._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{question.title || "Untitled Question"}</strong> -{" "}
                      {question.points} pts
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditQuestion(question._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Add new question button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                style={{
                  backgroundColor: "#f5f5f5",
                  borderColor: "#ccc",
                  color: "#333",
                  display: "block",
                  margin: "20px auto",
                  padding: "6px 12px",
                }}
                size="lg"
                onClick={handleAddQuestion}
              >
                + New Question
              </Button>
            </div>
            {newQuestion && (
              <QuestionEditor
                question={newQuestion}
                onChange={(updatedQuestion: any) =>
                  setNewQuestion(updatedQuestion)
                }
                onCancel={() => setNewQuestion(null)}
                onSave={(updatedQuestion: any) => {
                  setQuestions([
                    ...questions,
                    { ...updatedQuestion, isEditing: false },
                  ]);
                  setNewQuestion(null);
                }}
              />
            )}

            {questions.map(
              (question) =>
                question.isEditing && (
                  <QuestionEditor
                    key={question._id}
                    question={question}
                    onChange={(updatedQuestion: any) =>
                      handleQuestionChange(question._id, updatedQuestion)
                    }
                    onCancel={() => handleCancelQuestion(question._id)}
                    onSave={(updatedQuestion: any) =>
                      handleSaveQuestion(updatedQuestion)
                    }
                  />
                )
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
