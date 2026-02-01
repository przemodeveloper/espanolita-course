import type{ ListTask } from "@/models/tasks";
import axios from "axios";

export const getTasks = async () => {
  const response = await axios.get<ListTask[]>("/api/v2/tasks");
  return response.data;
};