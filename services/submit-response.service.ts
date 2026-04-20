import axios from "axios";

export const submitResponse = async (
  taskId: string,
  answers: { questionId: string; optionId?: string; answerText?: string }[],
): Promise<{
  attemptId: string;
  type: string;
  score: number;
  maxScore: number;
}> => {
  const response = await axios.post(`/api/v2/tasks/${taskId}/submit`, {
    answers,
  });
  return response.data;
};
