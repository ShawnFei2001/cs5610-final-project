import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER_A6 || "http://localhost:4000";
const QUIZZES_API = `${REMOTE_SERVER}/api`;
const axiosWithCredentials = axios.create({
  baseURL: REMOTE_SERVER,
  withCredentials: true
});

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/courses/${courseId}/quizzes`, quiz);
  return data;
};

export const findQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/quizzes/${quizId}`);
  return data;
};

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/courses/${courseId}/quizzes`);
  console.log("🟡 quizzes from db:", data);
  return data;
};

export const updateQuiz = async (quiz: any) => {
  const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/quizzes/${quiz._id}`, quiz);
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/quizzes/${quizId}`);
  return data;
};

export const getQuestions = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/quizzes/${quizId}/questions`);
  return response.data;
};

export const createQuestion = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/quizzes/${quizId}/questions`, question);
  return response.data;
};

export const updateQuestion = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/quizzes/${quizId}/questions/${question._id}`, question);
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/quizzes/${quizId}/questions/${questionId}`);
  return response.data;
};

export const getLastAttempt = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/quizzes/${quizId}/answers`);
  return data;
};

export const fetchQuizWithQuestions = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/quizzes/${quizId}`);
  return data;
};

export const fetchSavedAnswers = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/quiz-attempts/${quizId}`);
  return data;
};

export const submitQuizAnswers = async (quizId: string, answers: Record<string, any>) => {
  const { data } = await axiosWithCredentials.post(`${QUIZZES_API}/quiz-attempts/${quizId}/submit`, {
    answers,
  });
  return data;
};

export const autosaveAnswers = async (quizId: string, answers: Record<string, any>) => {
  const savedAt = new Date().toISOString();
  await axiosWithCredentials.put(`${QUIZZES_API}/quiz-attempts/${quizId}`, {
    answers,
    savedAt,
  });
};