import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Account from "./Account";
import Session from "./Account/Session";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import KambazNavigation from "./Navigation";
import "./styles.css";
import ProtectedRoute from "./Account/ProtectedRoute";
import ProtectedCourseRoute from "./Courses/ProtectedCourseRoute";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "",
    description: "",
  });
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  // BELOW: FOR MOCK PURPOSE ONLY
  useEffect(() => {
    if (currentUser) {
      // mock course data
      setCourses([
        { _id: "RS101", name: "React Basics", description: "Intro to React" },
        { _id: "JS201", name: "JavaScript Advanced", description: "Deep dive JS" }
      ]);
    }
  }, [currentUser]);

  // useEffect(() => {
  //   if (currentUser) {
  //     fetchCourses();
  //   }
  // }, [currentUser]);
// UP: FOR MOCK PURPOSE ONLY

  const addNewCourse = async () => {
    if (!course.name || !course.description) {
      alert("Course name and description are required.");
      return;
    }

    const newCourse = await userClient.createCourse(course);
    setCourses([...courses, newCourse]);
    setCourse({ name: "", description: "" });
  };

  const deleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId));
  };

  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(courses.map((c) => (c._id === course._id ? course : c)));
  };

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />

                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <ProtectedCourseRoute>
                    <Courses />
                  </ProtectedCourseRoute>
                </ProtectedRoute>
              }
            />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
