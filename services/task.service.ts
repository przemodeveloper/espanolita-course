import axios from "axios";
import type { Task } from "@/models/task";

export const getTask = async (taskId: string) => {
  const response = await axios.get<Task>(`/api/tasks/${taskId}`);
  return response.data;
};