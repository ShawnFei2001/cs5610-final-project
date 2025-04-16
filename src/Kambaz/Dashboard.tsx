import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCourse, addCourse, deleteCourse, updateCourse } from "./Courses/reducer";
import {
  toggleShowAllCourses,
  enroll,
  unenroll,
  setEnrollments
} from "./Enrollments/reducer";
import * as enrollmentsClient from "./Enrollments/client";
import { useEffect } from "react";

export default function Dashboard({ 
  courses, 
  course, 
  setCourse, 
  addNewCourse, 
  deleteCourse, 
  updateCourse,
  enrolling, 
  setEnrolling, 
  updateEnrollment 
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (id: string) => void;
  updateCourse: () => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const enrollmentState = useSelector((state: any) => state.enrollmentReducer);
  const { enrollments, showAllCourses } = enrollmentState || { enrollments: [], showAllCourses: false };

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const serverEnrollments = await enrollmentsClient.getAllEnrollments();
        dispatch(setEnrollments(serverEnrollments));
      } catch (error) {
        console.error("Failed to load enrollments:", error);
      }
    };
    fetchEnrollments();
  }, [dispatch]);

  const handleSetCourse = (newCourseData: any) => {
    setCourse(newCourseData);
  };

  const handleToggleShowAllCourses = () => {
    dispatch(toggleShowAllCourses());
    setEnrolling(!enrolling);
  };

  const handleEnroll = async (courseId: string) => {
    if (currentUser) {
      try {
        await enrollmentsClient.enrollInCourse(currentUser._id, courseId);
        dispatch(enroll({ userId: currentUser._id, courseId }));
        updateEnrollment(courseId, true);
      } catch (error) {
        console.error("Failed to enroll:", error);
      }
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (currentUser) {
      try {
        await enrollmentsClient.unenrollFromCourse(currentUser._id, courseId);
        dispatch(unenroll({ userId: currentUser._id, courseId }));
        updateEnrollment(courseId, false);
      } catch (error) {
        console.error("Failed to unenroll:", error);
      }
    }
  };

  const isEnrolled = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    return course?.enrolled === true;
  };

  const handleCourseNavigation = (event: React.MouseEvent, courseId: string) => {
    if (currentUser?.role === "STUDENT" && !isEnrolled(courseId)) {
      event.preventDefault();
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {currentUser?.role === "STUDENT" && (
        <div className="mb-3">
          <button
            className={showAllCourses ? "btn btn-secondary float-end" : "btn btn-primary float-end"}
            onClick={handleToggleShowAllCourses}
          >
            {showAllCourses ? "My Courses" : "All Courses"}
          </button>
        </div>
      )}

      {currentUser?.role === "FACULTY" && (
        <>
          <h5>New Course
            <button className="btn btn-primary float-end" onClick={addNewCourse}>Add</button>
            <button className="btn btn-warning float-end me-2" onClick={updateCourse}>Update</button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => handleSetCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            onChange={(e) => handleSetCourse({ ...course, description: e.target.value })}
          />
        </>
      )}

      <hr />
      <h2 id="wd-dashboard-published">
        {currentUser?.role === "STUDENT" && !showAllCourses
          ? "My Enrollments"
          : "Published Courses"} ({courses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course: any) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  to={`/Kambaz/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  onClick={(e) => handleCourseNavigation(e, course._id)}
                >
                  <Card.Img src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                  <Card.Body className="card-body">
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </Card.Title>
                    <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description}
                    </Card.Text>

                    {currentUser?.role === "STUDENT" ? (
                      isEnrolled(course._id) ? (
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            e.preventDefault();
                            handleUnenroll(course._id);
                          }}
                        >
                          Unenroll
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEnroll(course._id);
                          }}
                        >
                          Enroll
                        </Button>
                      )
                    ) : (
                      <Button variant="primary">Go</Button>
                    )}

                    {currentUser?.role === "FACULTY" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            deleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                        >
                          Delete
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSetCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}