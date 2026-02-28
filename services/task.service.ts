import axios from "axios";
import type { Task } from "@/models/task";

export const getTask = async (taskId: string): Promise<Task> => {
  const response = await axios.get(`/api/v2/tasks/${taskId}`);
  return response.data;
};
