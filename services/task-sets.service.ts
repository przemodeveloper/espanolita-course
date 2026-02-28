import axios from "axios";
import type { TaskSet } from "@/models/taskSets";

export const getTaskSets = async (): Promise<TaskSet[]> => {
  const response = await axios.get(`/api/v2/task-sets`);
  return response.data;
};
