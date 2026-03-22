import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./consts";
import { getProgress } from "@/services/progress.service";

export const useProgress = (taskSetId: string) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.PROGRESS, taskSetId],
    queryFn: async () => {
      const response = await getProgress();
      return response;
    },
    staleTime: Infinity,
  });
  return {
    progress: query.data,
    isLoading: query.isLoading,
    error: query.error,
    query,
  };
};
