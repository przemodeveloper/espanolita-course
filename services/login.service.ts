import axios from "axios";

export const login = async (email: string, password: string) => {
  const response = await axios.post("/api/login", {
    email,
    password,
  });
  return response.data;
};