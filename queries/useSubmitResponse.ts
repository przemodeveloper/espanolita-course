import { useMutation } from "@tanstack/react-query";
import { submitResponse } from "@/services/submit-response.service";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";

export const useSubmitResponse = (taskId: string) => {
  const { queryClient } = useCourseContext();
  const mutation = useMutation({
    mutationFn: ({
      taskId,
      answers,
    }: {
      taskId: string;
      answers: { questionId: string; optionId?: string; answerText?: string }[];
    }) => submitResponse(taskId, answers),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTEMPT, taskId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROGRESS] });
    },
  });
  return mutation;
};
