// In Kambaz/Users/dao.js

// Add debugging to your DAO functions
export const findUserByUsername = async (username) => {
  console.log(`DAO: Finding user by username: ${username}`);
  try {
    const user = await model.findOne({ username });
    if (user) {
      console.log(`DAO: User found: ${username}`);
    } else {
      console.log(`DAO: User not found: ${username}`);
    }
    return user;
  } catch (error) {
    console.error(`DAO Error finding user by username ${username}:`, error);
    throw error;
  }
};

export const findUserByCredentials = async (username, password) => {
  console.log(`DAO: Finding user by credentials: username=${username}`);
  try {
    // Check if raw MongoDB query works
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Log the raw MongoDB query
    console.log(`MongoDB raw query: db.users.findOne({username: "${username}", password: "${password}"})`);
    
    // Execute raw query first for debugging
    const rawResult = await collection.findOne({ username, password });
    console.log("Raw MongoDB result:", rawResult ? "User found" : "No user found");
    
    // Now use the model
    const user = await model.findOne({ username, password });
    if (user) {
      console.log(`DAO: User credentials match: ${username}`);
    } else {
      console.log(`DAO: User credentials don't match: ${username}`);
    }
    return user;
  } catch (error) {
    console.error(`DAO Error finding user by credentials ${username}:`, error);
    throw error;
  }
};