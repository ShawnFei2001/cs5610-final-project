import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import Lab5 from "./Lab5/index.js"
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

// Allow credentials in CORS
app.use(
  cors({
    credentials: true,
    origin: true, // This allows any origin with credentials
  })
);

// Session configuration
const sessionOptions = {
  secret: "kambaz-secret-key",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
  }),
  cookie: {
    secure: false, // Set to false to test locally
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'none'
  }
};

// Only use secure cookies in production
if (process.env.NODE_ENV === "production") {
  sessionOptions.cookie.secure = true;
  app.set('trust proxy', 1); // trust first proxy
}

app.use(session(sessionOptions));
app.use(express.json());

// Add a diagnostic route to check sessions
app.get("/api/debug-session", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    hasSession: !!req.session,
    user: req.session.currentUser || "No user in session"
  });
});

// Routes
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});