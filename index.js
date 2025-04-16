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
app.get("/api/debug-users-dao", async (req, res) => {
  try {
    console.log("Debug users DAO request received");
    
    // Import the model and DAO directly here for testing
    const userModel = await import("./Kambaz/Users/model.js");
    const userDao = await import("./Kambaz/Users/dao.js");
    
    // Check if model is properly exported
    console.log("User model imported:", !!userModel.default);
    console.log("User DAO imported:", !!userDao);
    
    // Try direct MongoDB query
    const usersCollection = mongoose.connection.db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`Direct query: users collection has ${userCount} documents`);
    
    // Try to find a user with direct MongoDB query
    const directUser = await usersCollection.findOne({});
    
    // Try to find a user with the DAO
    let daoUser = null;
    let modelUser = null;
    
    try {
      if (userDao.findAllUsers) {
        const users = await userDao.findAllUsers();
        daoUser = users && users.length > 0 ? users[0] : null;
        console.log("DAO findAllUsers succeeded:", !!daoUser);
      }
    } catch (daoError) {
      console.error("Error using DAO findAllUsers:", daoError);
    }
    
    try {
      if (userModel.default) {
        modelUser = await userModel.default.findOne({});
        console.log("Model findOne succeeded:", !!modelUser);
      }
    } catch (modelError) {
      console.error("Error using model findOne:", modelError);
    }
    
    // Send detailed debug info
    res.json({
      directQuery: {
        userCount,
        hasDirectUser: !!directUser,
        directUserFields: directUser ? Object.keys(directUser) : null
      },
      daoQuery: {
        hasDaoUser: !!daoUser,
        daoUserFields: daoUser ? Object.keys(daoUser) : null,
        daoFunctions: Object.keys(userDao)
      },
      modelQuery: {
        hasModelUser: !!modelUser,
        modelUserFields: modelUser ? Object.keys(modelUser) : null,
        isMongooseModel: userModel.default instanceof mongoose.Model
      }
    });
  } catch (error) {
    console.error("Users DAO debug error:", error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});
app.post("/api/debug-auth", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Debug auth attempt for username: ${username}`);
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    
    // Try direct MongoDB query first
    const usersCollection = mongoose.connection.db.collection('users');
    const directUser = await usersCollection.findOne({ username });
    console.log(`Direct query for user ${username}:`, !!directUser);
    
    if (directUser) {
      console.log(`Direct query: password match:`, directUser.password === password);
    }
    
    // Import the DAO
    const userDao = await import("./Kambaz/Users/dao.js");
    
    // Try each step of the authentication process
    let userByUsername = null;
    try {
      if (userDao.findUserByUsername) {
        userByUsername = await userDao.findUserByUsername(username);
        console.log(`DAO findUserByUsername result:`, !!userByUsername);
      }
    } catch (error) {
      console.error(`Error in findUserByUsername:`, error);
    }
    
    let userByCredentials = null;
    try {
      if (userDao.findUserByCredentials) {
        userByCredentials = await userDao.findUserByCredentials(username, password);
        console.log(`DAO findUserByCredentials result:`, !!userByCredentials);
      }
    } catch (error) {
      console.error(`Error in findUserByCredentials:`, error);
    }
    
    // Send detailed debug info
    res.json({
      directQuery: {
        userFound: !!directUser,
        passwordMatch: directUser ? directUser.password === password : false
      },
      daoQuery: {
        findUserByUsername: !!userByUsername,
        findUserByCredentials: !!userByCredentials,
        error: null
      }
    });
  } catch (error) {
    console.error("Auth debug error:", error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});

app.get("/api/debug-database", async (req, res) => {
  try {
    console.log("Debug database request received");
    
    // Check MongoDB connection status
    const state = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log(`MongoDB connection state: ${stateMap[state]}`);
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Collections in database:", collectionNames);
    
    // Count documents in each collection
    const counts = {};
    for (const name of collectionNames) {
      counts[name] = await mongoose.connection.db.collection(name).countDocuments();
      console.log(`Collection ${name} has ${counts[name]} documents`);
    }
    
    // If users collection exists, get a sample user
    let sampleUser = null;
    if (collectionNames.includes('users')) {
      sampleUser = await mongoose.connection.db.collection('users').findOne({});
      if (sampleUser) {
        // Don't log the entire user object in production as it contains sensitive info
        console.log("Sample user found with username:", sampleUser.username);
      } else {
        console.log("No users found in the users collection");
      }
    }
    
    // Check database name
    const dbName = mongoose.connection.db.databaseName;
    console.log("Connected to database:", dbName);
    
    // Send detailed debug info
    res.json({
      connectionState: stateMap[state],
      databaseName: dbName,
      collections: collectionNames,
      documentCounts: counts,
      hasSampleUser: !!sampleUser,
      sampleUserFields: sampleUser ? Object.keys(sampleUser) : null
    });
  } catch (error) {
    console.error("Database debug error:", error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
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