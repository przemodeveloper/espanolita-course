import { getTask } from "@/services/task.service";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "./consts";
import { useCourseContext } from "@/context/course-context";

export const useTask = ({
  taskId,
  enabled = true,
}: { taskId?: string; enabled?: boolean } = {}) => {
  const { queryClient } = useCourseContext();

  const options = queryOptions({
    queryKey: [QUERY_KEYS.TASK, taskId],
    queryFn: async () => {
      if (!taskId) {
        throw new Error("taskId is required");
      }
      const response = await getTask(taskId);
      return response;
    },
    enabled: enabled && Boolean(taskId),
    placeholderData: keepPreviousData,
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
    task: query.data,
    isPending: query.isPending,
    query,
    prefetchQuery,
  };
};
