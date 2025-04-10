import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
// import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
// import courseReducer from "./Courses/reducer";
// import enrollmentReducer from "./Enrollments/reducer";
import quizzesReducer from "./Courses/Quizzes/reducer";

// ✅ 临时加入 mock 的 accountReducer
const accountReducer = (
  state = { currentUser: { _id: "u001", role: "FACULTY" } },
  action: any
) => state;

const courseReducer = (
  state = {
    courses: [
      { _id: "RS101", name: "React Basics", description: "Learn React" },
      { _id: "CS102", name: "Node.js", description: "Backend programming" }
    ],
    course: {}
  },
  action: any
) => state;

const enrollmentReducer = (
  state = {
    enrollments: [
      { user: "u001", course: "RS101" },
      { user: "u001", course: "CS102" }
    ],
    showAllCourses: true
  },
  action: any
) => state; 

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    courseReducer,
    enrollmentReducer,
    quizzesReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;

export default store;