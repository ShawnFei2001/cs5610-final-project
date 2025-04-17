// index.js
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import Lab5 from "./Lab5/index.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

import { v4 as uuidv4 } from "uuid";

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";

console.log("Attempting to connect to MongoDB at:", CONNECTION_STRING);
mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// 1️⃣ Parse JSON bodies
app.use(express.json());

app.use(cors({
  origin: process.env.NETLIFY_URL,
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_STRING }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",   // 🔑 false in dev
    sameSite: process.env.NODE_ENV === "production"   // 🔑 'none' in prod…
      ? "none"
      : "lax",                                        // …but lax in dev
    maxAge: 24*60*60*1000,
  }
};
app.use(session(sessionOptions));


// 4️⃣ Trust proxy when in production (for secure cookies)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  console.log("Production: trust proxy enabled, cookies secure/none");
}

// 5️⃣ Debug middleware to inspect session on every request
app.use((req, res, next) => {
  console.log("=== Session Debug ===");
  console.log("Session ID:", req.sessionID);
  console.log("Has user:", !!req.session.currentUser);
  if (req.session.currentUser) {
    console.log("User:", req.session.currentUser.username);
  }
  console.log("=====================");
  next();
});

// 6️⃣ Special: check-session endpoint
app.get("/api/check-session", (req, res) => {
  res.json({
    sessionExists: !!req.session,
    sessionID: req.sessionID,
    hasUser: !!req.session.currentUser,
    user: req.session.currentUser || null,
  });
});

// 7️⃣ Direct course creation (with auto‐enroll)
app.post("/api/courses/direct", async (req, res) => {
  try {
    const user = req.session.currentUser;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const courseId = uuidv4();
    const courseData = { _id: courseId, ...req.body };
    await mongoose.connection.db.collection("courses").insertOne(courseData);

    const enrollment = {
      _id: uuidv4(),
      user: user._id,
      course: courseId,
      enrollmentDate: new Date(),
      status: "ENROLLED",
    };
    await mongoose
      .connection.db
      .collection("enrollments")
      .insertOne(enrollment);

    res.json(courseData);
  } catch (e) {
    console.error("[Direct Course Creation] Error:", e);
    res.status(500).json({ message: "Error creating course", error: e.message });
  }
});

// 8️⃣ Standard course creation
app.post("/api/courses", async (req, res) => {
  try {
    const user = req.session.currentUser;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const courseId = uuidv4();
    const courseData = { _id: courseId, ...req.body };
    await mongoose.connection.db.collection("courses").insertOne(courseData);

    const enrollment = {
      _id: uuidv4(),
      user: user._id,
      course: courseId,
      enrollmentDate: new Date(),
      status: "ENROLLED",
    };
    await mongoose.connection.db.collection("enrollments").insertOne(enrollment);

    res.json(courseData);
  } catch (e) {
    console.error("[Standard Course Creation] Error:", e);
    res.status(500).json({ message: "Error creating course", error: e.message });
  }
});

// 9️⃣ Mount all your route modules
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

console.log("All routes initialized");

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV})`)
);
