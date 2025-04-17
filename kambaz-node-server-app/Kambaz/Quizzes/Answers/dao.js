import model from "./model.js";

export function createAnswer(answer) {
    return model.create(answer);
  }
  
  export function findLatestAnswer(quizId, userId) {
    return model.findOne({ quizId, userId }).sort({ attemptDate: -1 });
  }
  