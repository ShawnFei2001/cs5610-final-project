import model from "./model.js";
import QuestionModel from "./Questions/model.js";

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
  export const findQuizById = async (quizId) => {
//     const quiz = await model.findById(quizId).lean();  // <- convert to plain object
//     const questions = await QuestionModel.find({ quizId });
//     console.log("Fetched quiz:", quiz);
// console.log("Fetched questions:", questions);
//     return { ...quiz, questions };
    const quiz = await model.findById(quizId);
    return quiz;
  };
  