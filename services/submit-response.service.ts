export const submitResponse = async (
  taskId: string,
  answers: { questionId: string; optionId?: string; answerText?: string }[],
): Promise<{
  attemptId: string;
  type: string;
  score: number;
  maxScore: number;
}> => {
  const response = await fetch(`/api/v2/tasks/${taskId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
  return response.json();
};
