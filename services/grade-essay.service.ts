import axios from "axios";
import type { GradeEssayRequest } from "@/models/grading";

export const gradeEssay = async (essayRequest: GradeEssayRequest) => {
  const response = await axios.post("/api/grade-essay", essayRequest);
  return response.data;
};
