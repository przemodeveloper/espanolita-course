import axios from "axios";

export type SubmitResponseResult = {
  attemptId: string;
  completed: true;
};

export const submitResponse = async (
  taskId: string,
  answers: { questionId: string; optionId?: string; answerText?: string }[],
): Promise<SubmitResponseResult> => {
  const response = await axios.post(`/api/v2/tasks/${taskId}/submit`, {
    answers,
  });
  return response.data;
};
