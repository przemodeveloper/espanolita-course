import { useMutation } from "@tanstack/react-query"
import { submitResponse } from "@/services/submit-response.service"

export const useSubmitResponse = () => {
  const mutation = useMutation({
    mutationFn: ({ taskId, answers }: { taskId: string, answers: { questionId: string, optionId?: string, answerText?: string }[] }) => submitResponse(taskId, answers),
  })
  return mutation
}