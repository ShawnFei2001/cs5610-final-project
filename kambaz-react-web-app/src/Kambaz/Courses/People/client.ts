import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/users`);
  return data;
};

export const createUser = async (user: any) => {
  const { data } = await axios.post(USERS_API, user);
  return data;
};

export const updateUser = async (user: any) => {
  const { data } = await axios.put(`${USERS_API}/${user._id}`, user);
  return data;
};

export const deleteUser = async (userId: string) => {
  await axios.delete(`${USERS_API}/${userId}`);
};
