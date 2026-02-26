import axios from "axios";

export const getAttempt = async (taskId: string) => {
  const response = await axios.get(`/api/v2/tasks/${taskId}/attempt`);
  return response.data;
}

export const deleteAttempt = async (taskId: string) => {
  const response = await axios.delete(`/api/v2/tasks/${taskId}/attempt`);
  return response.data;
}