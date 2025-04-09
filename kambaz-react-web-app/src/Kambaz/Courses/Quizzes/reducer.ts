import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定义 Quiz 类型
export interface QuizType {
  _id?: string;
  title: string;
  points: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  course: string;
}

// 定义 state 类型
interface QuizState {
  quizzes: QuizType[];
}

const initialState: QuizState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<QuizType[]>) => {
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
  },
});

export const { setQuizzes, addQuiz, deleteQuiz, updateQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;
