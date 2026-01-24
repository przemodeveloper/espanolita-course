import { getTask } from "@/services/task.service";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";

export const useTask = ({ taskId, enabled = false }: { taskId: string, enabled?: boolean } = { taskId: "" }) => {
  const { queryClient } = useCourseContext();

  const options = queryOptions({
    queryKey: [QUERY_KEYS.TASK, taskId],
    queryFn: async () => {
      const response = await getTask(taskId);
      return response;
    },
    enabled: enabled,
    staleTime: Infinity,
  });

  const query = useQuery(options);
  
  const prefetchQuery = (taskId: string) => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.TASK, taskId],
      queryFn: async () => {
        const response = await getTask(taskId);
        return response;
      },
    });
  };

  return {
    query,
    prefetchQuery,
  };
};