// Kambaz/Enrollments/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export async function findAllEnrollments() {
  return model.find();
}

export async function enrollUser(userId, courseId) {
  // Check if already enrolled
  const alreadyEnrolled = await model.findOne({ user: userId, course: courseId });
  if (alreadyEnrolled) {
    return null;
  }
  
  // Create new enrollment
  const enrollment = { 
    _id: uuidv4(),
    user: userId, 
    course: courseId,
    enrollmentDate: new Date(),
    status: "ENROLLED"
  };
  return model.create(enrollment);
}

export async function unenrollUser(userId, courseId) {
  const result = await model.deleteOne({ user: userId, course: courseId });
  return result.deletedCount > 0;
}

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map(enrollment => enrollment.course);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map(enrollment => enrollment.user);
}

export async function deleteEnrollmentsForCourse(courseId) {
  return model.deleteMany({ course: courseId });
}