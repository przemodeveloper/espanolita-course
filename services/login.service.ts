import axios from "axios";

export const login = async (
  email: string,
  password: string,
  turnstileToken: string,
): Promise<{ success: boolean; user: { id: string; email: string } }> => {
  const response = await axios.post("/api/login", {
    email,
    password,
    turnstileToken,
  });
  return response.data;
};
