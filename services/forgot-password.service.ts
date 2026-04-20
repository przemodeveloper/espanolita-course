import axios from "axios";

export const forgotPassword = async (email: string) => {
  const response = await axios.post("/api/forgot-password", { email });
  return response.data;
};
