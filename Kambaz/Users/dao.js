import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function createUser(user) {
  const newUser = { ...user, _id: uuidv4() };
  db.users = [...db.users, newUser];
  return newUser;
}

export function findAllUsers() {
  return db.users;
}

export function findUserById(userId) {
  return db.users.find((user) => user._id === userId);
}

export function findUserByUsername(username) {
  return db.users.find((user) => user.username === username);
}

export function findUserByCredentials(username, password) {
  return db.users.find((user) => user.username === username && user.password === password);
}

export function updateUser(userId, user) {
  db.users = db.users.map((u) =>
    u._id === userId ? { ...u, ...user } : u
  );
}

export function deleteUser(userId) {
  db.users = db.users.filter((u) => u._id !== userId);
}
