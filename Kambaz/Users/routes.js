// In Kambaz/Users/routes.js

// Add this to the top of your file
import mongoose from "mongoose";

export default function UserRoutes(app) {
  // Existing functions with added debugging...
  
  const signin = async (req, res) => {
    const { username, password } = req.body;
    console.log(`Signin attempt for user: ${username}`);
    
    try {
      // Log what we're looking for
      console.log(`Looking for user with username: ${username} and password: ${password}`);
      
      // First check if the user exists at all (without password check)
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
        
        // Explicitly save session
        await new Promise((resolve, reject) => {
          req.session.save(err => {
            if (err) {
              console.error("Error saving session:", err);
              reject(err);
            } else {
              console.log("Session saved successfully");
              resolve();
            }
          });
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
  
  // Add these debugging routes
  app.get("/api/users/debug", async (req, res) => {
    try {
      // Log all users in the database
      const users = await dao.findAllUsers();
      const sanitizedUsers = users.map(user => ({
        _id: user._id,
        username: user.username,
        role: user.role,
        // Don't send password in response
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
        // Send sanitized user
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
  
  // Your existing route registrations
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