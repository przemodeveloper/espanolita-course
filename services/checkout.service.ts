import axios from "axios";

export const postCheckout = async ({
  termsVersion,
}: {
  termsVersion: string;
}) => {
  const response = await axios.post("/api/checkout", { termsVersion });
  return response.data;
};
