import { useMutation } from "@tanstack/react-query";
import { deleteAttempt } from "@/services/attempt.service";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";

export const useDeleteAttempt = (taskId: string) => {
  const { queryClient } = useCourseContext();
  const mutation = useMutation({
    mutationFn: () => deleteAttempt(taskId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTEMPT, taskId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROGRESS] });
    },
  });
  return mutation;
};
