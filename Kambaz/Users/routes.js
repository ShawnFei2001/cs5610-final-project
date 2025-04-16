// Kambaz/Users/routes.js
import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import mongoose from "mongoose";

export default function UserRoutes(app) {
  // Define all functions first before using them
  
  const createUser = async (req, res) => {
    try {
      const user = await dao.createUser(req.body);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  };

  const findAllUsers = async (req, res) => {
    try {
      const { role, name } = req.query;
      let users;
      
      if (role) {
        users = await dao.findUsersByRole(role);
      } else if (name) {
        users = await dao.findUsersByPartialName(name);
      } else {
        users = await dao.findAllUsers();
      }
      
      res.json(users);
    } catch (error) {
      console.error("Error finding users:", error);
      res.status(500).json({ message: "Error finding users", error: error.message });
    }
  };

  const findUserById = async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error finding user by ID:", error);
      res.status(500).json({ message: "Error finding user", error: error.message });
    }
  };

  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const userUpdates = req.body;
      await dao.updateUser(userId, userUpdates);
      const currentUser = req.session["currentUser"];
      if (currentUser && currentUser._id === userId) {
        req.session["currentUser"] = { ...currentUser, ...userUpdates };
      }
      res.json(currentUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user", error: error.message });
    }
  };

  const signup = async (req, res) => {
    try {
      const existingUser = await dao.findUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already in use" });
      }
      const currentUser = await dao.createUser(req.body);
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({ message: "Error signing up", error: error.message });
    }
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    console.log(`Signin attempt for user: ${username}`);
    
    try {
      console.log(`Looking for user with username: ${username} and password: ${password}`);
      
      // First check if the user exists at all
      const userExists = await dao.findUserByUsername(username);
      
      if (!userExists) {
        console.log(`User with username '${username}' not found in database`);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      console.log(`User found in database: ${JSON.stringify(userExists)}`);
      
      // Now check credentials
      const currentUser = await dao.findUserByCredentials(username, password);
      
      if (currentUser) {
        console.log(`User authenticated successfully: ${currentUser.username}`);
        console.log(`User details: ${JSON.stringify(currentUser)}`);
        
        // Store in session
        req.session.currentUser = currentUser;
        
        // Debug session after setting
        console.log(`Session ID after authentication: ${req.sessionID}`);
        console.log(`Session after authentication: ${JSON.stringify(req.session)}`);
        
        // Save session
        req.session.save(err => {
          if (err) {
            console.error("Error saving session:", err);
          } else {
            console.log("Session saved successfully");
          }
        });
        
        return res.json(currentUser);
      } else {
        console.log(`Authentication failed for user: ${username} - password mismatch`);
        return res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error during login", error: error.message });
    }
  };

  const signout = (req, res) => {
    console.log("Signout request received");
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error signing out" });
      }
      console.log("Session destroyed successfully");
      res.sendStatus(200);
    });
  };

  const profile = (req, res) => {
    console.log("Profile request received");
    console.log("Session ID:", req.sessionID);
    console.log("Session:", JSON.stringify(req.session));
    
    if (req.session && req.session.currentUser) {
      console.log("User found in session:", req.session.currentUser.username);
      return res.json(req.session.currentUser);
    } else {
      console.log("No user in session");
      return res.status(401).json({ message: "Not authenticated" });
    }
  };
  
  const findCoursesForUser = async (req, res) => {
    try {
      console.log("Finding courses for user");
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        console.log("No user in session for findCoursesForUser");
        return res.sendStatus(401);
      }
      
      if (currentUser.role === "ADMIN") {
        console.log("Admin user - finding all courses");
        const courses = await courseDao.findAllCourses();
        return res.json(courses);
      }
      
      let { uid } = req.params;
      if (uid === "current") {
        uid = currentUser._id;
      }
      
      console.log(`Finding courses for user: ${uid}`);
      const courses = await enrollmentsDao.findCoursesForUser(uid);
      res.json(courses);
    } catch (error) {
      console.error("Error finding courses for user:", error);
      res.status(500).json({ message: "Error finding courses", error: error.message });
    }
  };

  const enrollUserInCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          return res.sendStatus(401);
        }
        uid = currentUser._id;
      }
      
      const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.send(status);
    } catch (error) {
      console.error("Error enrolling user in course:", error);
      res.status(500).json({ message: "Error enrolling user", error: error.message });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          return res.sendStatus(401);
        }
        uid = currentUser._id;
      }
      
      const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.send(status);
    } catch (error) {
      console.error("Error unenrolling user from course:", error);
      res.status(500).json({ message: "Error unenrolling user", error: error.message });
    }
  };

  const findUsersInCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(courseId);
      res.json(users);
    } catch (error) {
      console.error("Error finding users in course:", error);
      res.status(500).json({ message: "Error finding users", error: error.message });
    }
  };

  // Debug routes
  app.get("/api/users/debug", async (req, res) => {
    try {
      const users = await dao.findAllUsers();
      const sanitizedUsers = users.map(user => ({
        _id: user._id,
        username: user.username,
        role: user.role,
        hasPassword: !!user.password
      }));
      
      console.log(`Users in database: ${users.length}`);
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/users/debug/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const user = await dao.findUserByUsername(username);
      
      if (user) {
        console.log(`Found user: ${username}`);
        const sanitizedUser = {
          _id: user._id,
          username: user.username,
          role: user.role,
          hasPassword: !!user.password,
          passwordLength: user.password ? user.password.length : 0
        };
        res.json(sanitizedUser);
      } else {
        console.log(`User not found: ${username}`);
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(`Error finding user ${req.params.username}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Now register all routes after all functions are defined
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/:uid/courses", findCoursesForUser);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  app.get("/api/courses/:courseId/users", findUsersInCourse);
}