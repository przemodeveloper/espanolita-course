import axios from "axios";

export type TaskSetProgressEntry = {
  taskSetId: string;
  title: string;
  completedTasks: string[];
  totalTasksCount: number;
  completedTasksCount: number;
};

export const getProgress = async (): Promise<{
  taskSets: Record<string, TaskSetProgressEntry>;
}> => {
  const response = await axios.get("/api/v2/progress");
  return response.data;
};
