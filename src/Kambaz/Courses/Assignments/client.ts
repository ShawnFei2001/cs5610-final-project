import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER_A6;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api`;

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
    const { data } = await axios.post(`${ASSIGNMENTS_API}/courses/${courseId}/assignments`, assignment);
    return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
    const { data } = await axios.get(`${ASSIGNMENTS_API}/courses/${courseId}/assignments`);
    return data;
};

export const updateAssignment = async (assignment: any) => {
    const { data } = await axios.put(`${ASSIGNMENTS_API}/assignments/${assignment._id}`, assignment);
    return data;
};

export const deleteAssignment = async (assignmentId: string) => {
    const { data } = await axios.delete(`${ASSIGNMENTS_API}/assignments/${assignmentId}`);
    return data;
};
