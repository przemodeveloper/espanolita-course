import { useMutation } from "@tanstack/react-query";
import { gradeEssay } from "@/services/grade-essay.service";
import type { GradeEssayRequest } from "@/models/grading";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";

export const useGradeEssay = (taskId: string) => {
  const { queryClient } = useCourseContext();
  const mutation = useMutation({
    mutationFn: (essayRequest: GradeEssayRequest) =>
      gradeEssay(taskId, essayRequest),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTEMPT, taskId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROGRESS] });
    },
  });
  return mutation;
};
