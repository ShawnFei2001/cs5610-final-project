import model from "./model.js";

export function createQuiz(quiz) {
    return model.create(quiz);
  }
  
  export function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
  }
  
  export function updateQuiz(quizId, updates) {
    return model.findByIdAndUpdate(quizId, updates, { new: true });
  }
  
  export function deleteQuiz(quizId) {
    return model.findByIdAndDelete(quizId);
  }
  