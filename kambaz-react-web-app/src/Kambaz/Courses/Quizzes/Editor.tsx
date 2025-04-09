import { Form, Button, FormControl } from "react-bootstrap";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateQuiz, addQuiz } from "./reducer";
import * as quizzesClient from "./client";

interface QuizType {
  _id: string;
  title: string;
  points: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  course : string;
}

export default function QuizEditor() {
  const { qid,cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const existingQuiz = quizzes.find((q: any) => q._id === qid);


  const [editedQuiz, setEditedQuiz] = useState<QuizType>({
    _id: existingQuiz?._id || qid || "",
    title: existingQuiz?.title || "",
    points: existingQuiz?.points || 10,
    dueDate: existingQuiz?.dueDate || "",
    availableFrom: existingQuiz?.availableFrom || "",
    availableUntil: existingQuiz?.availableUntil || "",
    course: (existingQuiz?.course ?? cid ?? "") as string,
  });

  const handleSave = async () => {
    if (existingQuiz) {
      const updated = await quizzesClient.updateQuiz(editedQuiz);
      dispatch(updateQuiz(updated));
    } else {
      dispatch(addQuiz(editedQuiz));
    }
    navigate(`/Kambaz/Courses/${editedQuiz.course}/Quizzes/${editedQuiz._id}`);
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">{existingQuiz ? "Edit Quiz" : "Create New Quiz"}</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <FormControl
            value={editedQuiz.title}
            onChange={(e) =>
              setEditedQuiz({ ...editedQuiz, title: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Points</Form.Label>
          <FormControl
            type="number"
            value={editedQuiz.points}
            onChange={(e) =>
              setEditedQuiz({ ...editedQuiz, points: Number(e.target.value) })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date</Form.Label>
          <FormControl
            type="datetime-local"
            value={editedQuiz.dueDate}
            onChange={(e) =>
              setEditedQuiz({ ...editedQuiz, dueDate: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Available From</Form.Label>
          <FormControl
            type="datetime-local"
            value={editedQuiz.availableFrom}
            onChange={(e) =>
              setEditedQuiz({ ...editedQuiz, availableFrom: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Available Until</Form.Label>
          <FormControl
            type="datetime-local"
            value={editedQuiz.availableUntil}
            onChange={(e) =>
              setEditedQuiz({ ...editedQuiz, availableUntil: e.target.value })
            }
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Form>
    </div>
  );
}
