import { getAttempt } from "@/services/attempt.service"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./consts"

export const useAttempt = (taskId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.ATTEMPT, taskId],
    queryFn: () => getAttempt(taskId),
  })
  return { attempt: data, isLoading, error }
}