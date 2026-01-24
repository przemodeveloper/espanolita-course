import type{ ListTask } from "@/models/tasks";
import axios from "axios";

export const getTasks = async () => {
  const response = await axios.get<ListTask[]>("/api/tasks");
  return response.data;
};