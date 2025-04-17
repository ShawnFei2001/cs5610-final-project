import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Quiz Type
export interface QuizType {
  _id?: string;
  title: string;
  points: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  course: string;
  score?: number;
  questions?: number;
  published?: boolean;
}

// define state
interface QuizState {
  quizzes: QuizType[];
}

interface QuestionType {
  _id?: string;
  title: string;
  points: number;
  text: string;
  correctAnswer?: any;
  type: string;
  isEditing?: boolean;
  quiz: string; 
  course: string;
}

interface QuizState {
  quizzes: QuizType[];
  questions: QuestionType[];
}

const initialState: QuizState = {
  quizzes: [],
  questions: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<QuizType[]>) => {
      console.log("[Redux] SET_QUIZZES called with:", action.payload);
      state.quizzes = action.payload;
    },
    addQuiz: (state, action: PayloadAction<QuizType>) => {
      state.quizzes.push(action.payload);
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
    },
    updateQuiz: (state, action: PayloadAction<QuizType>) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    setQuestions: (state, action: PayloadAction<QuestionType[]>) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action: PayloadAction<QuestionType>) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<QuestionType>) => {
      state.questions = state.questions.map((q) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((q) => q._id !== action.payload);
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = quizzesSlice.actions;
export default quizzesSlice.reducer;
