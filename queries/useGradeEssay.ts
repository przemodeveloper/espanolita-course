import { useMutation } from "@tanstack/react-query";
import { gradeEssay } from "@/services/grade-essay.service";
import type { GradeEssayRequest } from "@/models/grading";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";
import { useNotificationContext } from "@/context/notification-context";
import type { AxiosError } from "axios";

export const useGradeEssay = (taskId: string) => {
  const { queryClient } = useCourseContext();
  const { notify } = useNotificationContext();
  const mutation = useMutation({
    mutationFn: (essayRequest: GradeEssayRequest) =>
      gradeEssay(taskId, essayRequest),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTEMPT, taskId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROGRESS] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      notify(
        error.response?.data?.error ?? "Wystąpił błąd, spróbuj ponownie",
        "error",
      );
    },
  });
  return mutation;
};
