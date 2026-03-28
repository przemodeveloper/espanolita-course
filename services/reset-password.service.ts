import axios from "axios";

export const resetPassword = async (password: string) => {
  const response = await axios.post("/api/reset-password", { password });
  return response.data;
};
