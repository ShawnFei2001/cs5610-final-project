// import React from "react";
// import { Button, Form, Card, Row, Col } from "react-bootstrap";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { FaArrowRight } from "react-icons/fa";
// import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";


// export default function QuestionEditor({
//   question,
//   onChange,
//   onCancel,
//   onSave,
// }: any) {
//   const handleInputChange = (field: string, value: any) => {
//     onChange({ ...question, [field]: value });
//   };

//   return (
//     <Card className="p-4 mb-4">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <div className="d-flex align-items-center">
//           {/* Title */}
//           <Form.Control
//             type="text"
//             placeholder="Question Title"
//             value={question.title}
//             onChange={(e) => handleInputChange("title", e.target.value)}
//             style={{ width: 300 }}
//           />
//           {/* Type */}
//           <Form.Select
//             value={question.type || "True/False"}
//             onChange={(e) => handleInputChange("type", e.target.value)}
//             style={{ width: 400, marginLeft: "16px" }}
//           >
//             <option>True/False</option>
//             <option>Multiple Choice</option>
//             <option>Fill in the Blank</option>
//           </Form.Select>
//         </div>
//         {/* 右边：Points */}
//         <div className="d-flex align-items-center">
//           <span className="me-2">pts:</span>
//           <Form.Control
//             type="number"
//             value={question.points}
//             onChange={(e) =>
//               handleInputChange("points", parseInt(e.target.value))
//             }
//             style={{ width: "80px" }}
//             min={0}
//           />
//         </div>
//       </div>

//       <div className="text-muted mb-3" style={{ fontSize: "14px" }}>
//         Enter your question text, then select if True or False is the correct
//         answer.
//       </div>

//       {/* Question Content Editor */}
//       <Form.Group className="mb-4">
//         <Form.Label className="fw-bold">Question:</Form.Label>
//         <TinyMCEEditor
//           tinymceScriptSrc="/tinymce/tinymce.min.js"
//           value={question.text}
//           onEditorChange={(content) => handleInputChange("text", content)}
//           init={{
//             height: 200,
//             menubar: "edit view insert format tools table",
//             plugins: "table",
//             toolbar:
//               "fontsizeselect formatselect | bold italic underline | forecolor backcolor | superscript subscript | removeformat",
//             fontsize_formats: "12pt",
//             content_style:
//               "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//             branding: false,
//             statusbar: false,
//             setup: (editor) => {
//               editor.on("init", () => {
//                 editor.execCommand("FontSize", false, "12pt");
//               });
//             },
//           }}
//         />
//       </Form.Group>

//       {/* Answer Choice */}
//       <Form.Group className="mb-4">
//         <Form.Label className="fw-bold">Answers:</Form.Label>
//         <div className="d-flex flex-column">
//           <div
//             role="button"
//             className="d-flex align-items-center mb-2"
//             onClick={() => handleInputChange("correctAnswer", true)}
//             style={{ cursor: "pointer" }}
//           >
//             {question.correctAnswer === true && (
//               <FaArrowRight className="text-success me-2" />
//             )}
//             <span
//               className={
//                 question.correctAnswer === true ? "text-success fw-bold" : ""
//               }
//             >
//               True
//             </span>
//           </div>
//           <div
//             role="button"
//             className="d-flex align-items-center"
//             onClick={() => handleInputChange("correctAnswer", false)}
//             style={{ cursor: "pointer" }}
//           >
//             {question.correctAnswer === false && (
//               <FaArrowRight className="text-success me-2" />
//             )}
//             <span
//               className={
//                 question.correctAnswer === false ? "text-success fw-bold" : ""
//               }
//             >
//               False
//             </span>
//           </div>
//         </div>
//       </Form.Group>

//       {/* 按钮区域 */}
//       <div className="d-flex gap-2">
//         <Button variant="secondary" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button variant="danger" onClick={onSave}>
//           Update Question
//         </Button>
//       </div>
//     </Card>
//   );
// }


import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";


export default function QuestionEditor({ question, onChange, onCancel, onSave }: any) {
  const handleInputChange = (field: string, value: any) => {
    onChange({ ...question, [field]: value });
  };

  // render different question types
  function renderAnswerEditor() {
    switch (question.type) {
      case "True/False":
        return renderTrueFalseEditor();
      case "Multiple Choice":
        return renderMultipleChoiceEditor();
      case "Fill in the Blank":
        return renderFillBlankEditor();
      default:
        return null;
    }
  }

  // True/False Editor
  function renderTrueFalseEditor() {
    return (
      <Card className="p-4 mb-4">
        {/* Top Row: Title / Type / Points */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Question Title"
              value={question.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              style={{ width: 300 }}
            />
            <Form.Select
              value={question.type || "True/False"}
              onChange={(e) => handleInputChange("type", e.target.value)}
              style={{ width: 400, marginLeft: "16px" }}
            >
              <option>True/False</option>
              <option>Multiple Choice</option>
              <option>Fill in the Blank</option>
            </Form.Select>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <Form.Control
              type="number"
              value={question.points}
              onChange={(e) =>
                handleInputChange("points", parseInt(e.target.value))
              }
              style={{ width: "80px" }}
              min={0}
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-muted mb-3" style={{ fontSize: "14px" }}>
          Enter your question text, then select if True or False is the correct answer.
        </div>

        {/* Editor */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold mb-2">Question:</Form.Label>
          <TinyMCEEditor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={question.text}
            onEditorChange={(content) => handleInputChange("text", content)}
            init={{
              height: 200,
              menubar: "edit view insert format tools table",
              plugins: "table",
              toolbar:
                "fontsizeselect formatselect | bold italic underline | forecolor backcolor | superscript subscript | removeformat",
              fontsize_formats: "12pt",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              branding: false,
              statusbar: false,
              setup: (editor) => {
                editor.on("init", () => {
                  editor.execCommand("FontSize", false, "12pt");
                });
              },
            }}
          />
        </Form.Group>

        {/* Answers */}
        <Form.Group className="mb-4 mt-4">
          <Form.Label className="fw-bold">Answers:</Form.Label>
          <div className="d-flex flex-column">
            {["True", "False"].map((option) => (
              <div
                key={option}
                role="button"
                className="d-flex align-items-center mb-2"
                onClick={() => handleInputChange("correctAnswer", option === "True")}
                style={{ cursor: "pointer" }}
              >
                {question.correctAnswer === (option === "True") && (
                  <FaArrowRight className="text-success me-2" />
                )}
                <span
                  className={
                    question.correctAnswer === (option === "True")
                      ? "text-success fw-bold"
                      : ""
                  }
                >
                  {option}
                </span>
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onSave(question)}>
            Update Question
          </Button>
        </div>
      </Card>
    );
  }

  // Multiple Choice 占位
  function renderMultipleChoiceEditor() {
    return (
      <Card className="p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Question Title"
              value={question.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              style={{ width: 300 }}
            />
            <Form.Select
              value={question.type || "True/False"}
              onChange={(e) => handleInputChange("type", e.target.value)}
              style={{ width: 400, marginLeft: "16px" }}
            >
              <option>True/False</option>
              <option>Multiple Choice</option>
              <option>Fill in the Blank</option>
            </Form.Select>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <Form.Control
              type="number"
              value={question.points}
              onChange={(e) =>
                handleInputChange("points", parseInt(e.target.value))
              }
              style={{ width: "80px" }}
              min={0}
            />
          </div>
        </div>
        <div className="mb-3 fw-bold">[Multiple Choice Editor Placeholder]</div>
        <div className="text-muted mb-4">This is where multiple choice UI will go.</div>
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="danger" onClick={onSave}>
          Update Question
        </Button>
      </Card>
    );
  }

  // Fill in the Blank 占位
  function renderFillBlankEditor() {
    return (
      <Card className="p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Question Title"
              value={question.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              style={{ width: 300 }}
            />
            <Form.Select
              value={question.type || "True/False"}
              onChange={(e) => handleInputChange("type", e.target.value)}
              style={{ width: 400, marginLeft: "16px" }}
            >
              <option>True/False</option>
              <option>Multiple Choice</option>
              <option>Fill in the Blank</option>
            </Form.Select>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <Form.Control
              type="number"
              value={question.points}
              onChange={(e) =>
                handleInputChange("points", parseInt(e.target.value))
              }
              style={{ width: "80px" }}
              min={0}
            />
          </div>
        </div>
        <div className="mb-3 fw-bold">[Fill in the Blank Editor Placeholder]</div>
        <div className="text-muted mb-4">This is where fill in the blank UI will go.</div>
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="danger" onClick={onSave}>
          Update Question
        </Button>
      </Card>
    );
  }

  // 渲染主界面
  return <>{renderAnswerEditor()}</>;
}
