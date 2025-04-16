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

// Log MongoDB connection attempt
console.log("Attempting to connect to MongoDB at:", CONNECTION_STRING);

mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// Debug incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure CORS with debugging
app.use(
  cors({
    credentials: true,
    origin: true, // Accept any origin with credentials
  })
);

console.log("CORS configured with credentials allowed");

// Session store with debugging
const sessionStore = MongoStore.create({
  mongoUrl: CONNECTION_STRING,
  ttl: 14 * 24 * 60 * 60, // 14 days
  autoRemove: 'native',
  touchAfter: 24 * 3600 // 1 day
});

sessionStore.on('create', (sessionId) => {
  console.log(`New session created: ${sessionId}`);
});

sessionStore.on('touch', (sessionId) => {
  console.log(`Session touched: ${sessionId}`);
});

sessionStore.on('destroy', (sessionId) => {
  console.log(`Session destroyed: ${sessionId}`);
});

// Session configuration
const sessionOptions = {
  secret: "kambaz-secret-key",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
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
  console.log("Production mode: Enabled secure cookies and trust proxy");
}

console.log("Session options configured:", JSON.stringify(sessionOptions, null, 2));

app.use(session(sessionOptions));
app.use(express.json());

// Add debug routes
app.get("/api/debug-session", (req, res) => {
  console.log("Debug session request");
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  
  res.json({
    sessionID: req.sessionID,
    hasSession: !!req.session,
    user: req.session.currentUser || "No user in session"
  });
});

app.get("/api/debug-db", async (req, res) => {
  try {
    // Get connection status
    const state = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    console.log("MongoDB connection state:", stateMap[state]);
    
    // Check if we can access the users collection
    const usersCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log("Users in database:", usersCount);
    
    res.json({
      connectionState: stateMap[state],
      usersCount,
      connectionString: CONNECTION_STRING.replace(/:[^:]*@/, ':[PASSWORD]@') // Hide password if present
    });
  } catch (error) {
    console.error("Error in debug-db:", error);
    res.status(500).json({ error: error.message });
  }
});

// Routes
console.log("Initializing routes...");
UserRoutes(app);
CourseRoutes(app);
Lab5(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
console.log("All routes initialized");

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});