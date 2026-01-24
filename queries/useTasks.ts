import { getTasks } from "@/services/tasks.service";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./consts";

export const useTasks = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TASKS],
    queryFn: () => getTasks(),
    enabled,
    staleTime: Infinity
  });

  return {
    tasks: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};