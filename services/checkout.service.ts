import axios from "axios";

export const postCheckout = async () => {
  const response = await axios.post("/api/checkout");
  return response.data;
};