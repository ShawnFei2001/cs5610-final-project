import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api`;

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const { data } = await axios.post(`${QUIZZES_API}/courses/${courseId}/quizzes`, quiz);
  return data;
};

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/courses/${courseId}/quizzes`);
  return data;
};

export const updateQuiz = async (quiz: any) => {
  const { data } = await axios.put(`${QUIZZES_API}/quizzes/${quiz._id}`, quiz);
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axios.delete(`${QUIZZES_API}/quizzes/${quizId}`);
  return data;
};
