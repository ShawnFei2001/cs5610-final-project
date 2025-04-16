import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
}

export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) => model.findOne({ username: username });
export const findUsersByRole = (role) => model.find({ role: role });
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};

export const findUserByCredentials = async (username, password) => {
  try {
    // For MongoDB
    const user = await model.findOne({ username, password });
    return user;
  } catch (error) {
    console.error("Error finding user by credentials:", error);
    return null;
  }
};export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });