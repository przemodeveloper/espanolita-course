import axios from "axios";
import type { Attempt } from "@/models/attempt";

export const getAttempt = async (taskId: string): Promise<Attempt> => {
  const response = await axios.get(`/api/v2/tasks/${taskId}/attempt`);
  return response.data;
};

export const deleteAttempt = async (
  taskId: string,
): Promise<{ success: boolean }> => {
  const response = await axios.delete(`/api/v2/tasks/${taskId}/attempt`);
  return response.data;
};
