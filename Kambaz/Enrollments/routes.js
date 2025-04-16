import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
 const findCoursesForUser = async (req, res) => {
   const currentUser = req.session["currentUser"];
   if (!currentUser) {
     res.sendStatus(401);
     return;
   }
   if (currentUser.role === "ADMIN") {
     const courses = await courseDao.findAllCourses();
     res.json(courses);
     return;
   }
   let { uid } = req.params;
   if (uid === "current") {
     uid = currentUser._id;
   }
   const courses = await enrollmentsDao.findCoursesForUser(uid);
   res.json(courses);
 };
 
 const enrollUserInCourse = async (req, res) => {
   let { uid, cid } = req.params;
   if (uid === "current") {
     const currentUser = req.session["currentUser"];
     uid = currentUser._id;
   }
   const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
   res.send(status);
 };
 
 const unenrollUserFromCourse = async (req, res) => {
   let { uid, cid } = req.params;
   if (uid === "current") {
     const currentUser = req.session["currentUser"];
     uid = currentUser._id;
   }
   const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
   res.send(status);
 };
 
 app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
 app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
 app.get("/api/users/:uid/courses", findCoursesForUser);
}