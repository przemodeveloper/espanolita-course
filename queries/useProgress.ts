import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./consts";
import { getProgress } from "@/services/progress.service";

export const useProgress = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.PROGRESS],
    queryFn: async () => {
      const response = await getProgress();
      return response;
    },
    staleTime: Infinity,
  
  })
  return { progress: query.data, isLoading: query.isLoading, error: query.error, query }
}