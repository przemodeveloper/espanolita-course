import axios from "axios";

export const getTaskSets = async () => {
  const response = await axios.get(`/api/v2/task-sets`);
  return response.data;
};