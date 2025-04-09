import Database from "../Database/index.js";

export function enrollUser(userId, courseId) {
  const already = Database.enrollments.some(e => e.user === userId && e.course === courseId);
  if (!already) {
    const enrollment = { user: userId, course: courseId };
    Database.enrollments.push(enrollment);
    return enrollment;
  }
  return null;
}

export function unenrollUser(userId, courseId) {
  const before = Database.enrollments.length;
  Database.enrollments = Database.enrollments.filter(
    (e) => !(e.user === userId && e.course === courseId)
  );
  return Database.enrollments.length < before;
}

export function findAllEnrollments() {
  return Database.enrollments;
}
