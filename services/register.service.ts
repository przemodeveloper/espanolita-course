import axios from "axios";

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
  const response = await axios.post("/api/register", {
    firstName,
    lastName,
    email,
    password,
  });
  return response.data;
};