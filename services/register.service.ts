import axios from "axios";

export const register = async (email: string, password: string) => {
  const response = await axios.post("/api/register", {
    email,
    password,
  });
  return response.data;
};