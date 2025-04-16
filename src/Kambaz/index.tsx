import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
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
import { setCourses } from "./Courses/reducer";

export default function Kambaz() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [courses, setCourseState] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "",
    description: "",
  });
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const dispatch = useDispatch();

  const findCoursesForUser = async () => {
    try {
      const courses = await userClient.findCoursesForUser(currentUser._id);
      setCourseState(courses || []);
      dispatch(setCourses(courses || []));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      const coursesWithStatus = allCourses.map((course: any) => {
        if (enrolledCourses.find((c: any) => c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return { ...course, enrolled: false };
        }
      });
      setCourseState(coursesWithStatus);
      dispatch(setCourses(coursesWithStatus));
    } catch (error) {
      console.error(error);
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (enrolled) {
      await userClient.enrollIntoCourse(currentUser._id, courseId);
    } else {
      await userClient.unenrollFromCourse(currentUser._id, courseId);
    }
    setCourseState(
      courses.map((course) => {
        if (course._id === courseId) {
          return { ...course, enrolled: enrolled };
        } else {
          return course;
        }
      })
    );
  };

  useEffect(() => {
    if (currentUser) {
      if (enrolling) {
        fetchCourses();
      } else {
        findCoursesForUser();
      }
    }
  }, [currentUser, enrolling]);

  const addNewCourse = async () => {
    if (!course.name || !course.description) {
      alert("Course name and description are required.");
      return;
    }

    const newCourse = await courseClient.createCourse(course);
    setCourseState([...courses, newCourse]);
    setCourse({ name: "", description: "" });
  };

  const deleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    setCourseState(courses.filter((course) => course._id !== courseId));
  };

  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourseState(courses.map((c) => (c._id === course._id ? course : c)));
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
                  <Dashboard 
                    courses={courses} 
                    course={course} 
                    setCourse={setCourse}
                    addNewCourse={addNewCourse} 
                    deleteCourse={deleteCourse} 
                    updateCourse={updateCourse}
                    enrolling={enrolling} 
                    setEnrolling={setEnrolling} 
                    updateEnrollment={updateEnrollment}
                  />
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