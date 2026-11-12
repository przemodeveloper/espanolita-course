import { getAttempt } from "@/services/attempt.service";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";

export const useAttempt = (taskId?: string) => {
  const { queryClient } = useCourseContext();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.ATTEMPT, taskId],
    queryFn: () => {
      if (!taskId) throw new Error("taskId is required");
      return getAttempt(taskId);
    },
    staleTime: Infinity,
    enabled: Boolean(taskId),
  });

  const prefetchAttempt = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.ATTEMPT, id],
      queryFn: () => getAttempt(id),
      staleTime: Infinity,
    });
  };

  return { attempt: data, isLoading, error, prefetchAttempt };
};
