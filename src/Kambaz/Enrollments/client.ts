import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER_A6;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

export const enrollInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(ENROLLMENTS_API, { userId, courseId });
  return data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.delete(ENROLLMENTS_API, {
    data: { userId, courseId },
  });
  return data;
};

export const getAllEnrollments = async () => {
  const { data } = await axios.get(ENROLLMENTS_API);
  return data;
};
export function findCoursesForUser(_id: any) {
  throw new Error("Function not implemented.");
}

