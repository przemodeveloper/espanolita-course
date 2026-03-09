import { useMutation } from "@tanstack/react-query";
import { gradeEssay } from "@/services/grade-essay.service";
import type { GradeEssayRequest } from "@/models/grading";

export const useGradeEssay = (taskId: string) => {
  const mutation = useMutation({
    mutationFn: (essayRequest: GradeEssayRequest) =>
      gradeEssay(taskId, essayRequest),
  });
  return mutation;
};
