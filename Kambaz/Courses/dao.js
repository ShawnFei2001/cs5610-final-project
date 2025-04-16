import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export async function findAllCourses() {
  return model.find();
}

export async function findCoursesForEnrolledUser(userId) {
  // Use the enrollment DAO function to get courses for a user
  return enrollmentsDao.findCoursesForUser(userId);
}

export async function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}

export async function deleteCourse(courseId) {
  // First delete enrollments related to this course
  await enrollmentsDao.deleteEnrollmentsForCourse(courseId);
  // Then delete the course
  return model.deleteOne({ _id: courseId });
}

export async function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}