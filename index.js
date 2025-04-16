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
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

const app = express();

// Configure CORS to accept requests from your frontend
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.NETLIFY_URL || "http://localhost:5173",
      "https://a6--creative-pegasus-483187.netlify.app"
    ],
  })
);

// Configure session storage using MongoDB
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    ttl: 60 * 60 * 24 // 1 day
  }),
  cookie: {
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  // Only set domain if it's defined
  if (process.env.NODE_SERVER_DOMAIN) {
    sessionOptions.cookie.domain = process.env.NODE_SERVER_DOMAIN;
  }
}

app.use(session(sessionOptions));
app.use(express.json());

// Debugging middleware for session
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session user:", req.session.currentUser);
  next();
});

// Routes
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});