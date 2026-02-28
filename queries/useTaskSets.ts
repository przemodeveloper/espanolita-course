import { getTaskSets } from "@/services/task-sets.service";
import { QUERY_KEYS } from "./consts";
import { useQuery } from "@tanstack/react-query";

export const useTaskSets = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TASK_SETS],
    queryFn: () => getTaskSets(),
    staleTime: Infinity,
    enabled,
  });

  return {
    taskSets: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
