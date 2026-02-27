import axios from "axios"

export const getProgress = async () => {
  const response = await axios.get("/api/v2/progress")
  return response.data
}