import { useMutation } from "@tanstack/react-query";
import {
  aiGradeTask,
  type AiGradeTaskRequest,
} from "@/services/ai-grade-task.service";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";
import { useNotificationContext } from "@/context/notification-context";
import type { AxiosError } from "axios";
import type { AiUsageKind } from "@/lib/aiUsage";

export const useAiGradeTask = (taskId: string, kind: AiUsageKind) => {
  const { queryClient } = useCourseContext();
  const { notify } = useNotificationContext();
  const mutation = useMutation({
    mutationFn: (request: AiGradeTaskRequest) =>
      aiGradeTask(taskId, kind, request),
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
