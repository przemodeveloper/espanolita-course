import axios from "axios";

export const getProgress = async (): Promise<{
  [taskId: string]: { completed: boolean; score: number; attemptId: string };
}> => {
  const response = await axios.get("/api/v2/progress");
  return response.data;
};
