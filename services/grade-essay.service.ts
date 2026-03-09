import axios from "axios";
import type { GradeEssayRequest } from "@/models/grading";

export const gradeEssay = async (
  taskId: string,
  essayRequest: GradeEssayRequest,
) => {
  const response = await axios.post(
    `/api/v2/tasks/${taskId}/grade-essay`,
    essayRequest,
  );
  return response.data;
};
