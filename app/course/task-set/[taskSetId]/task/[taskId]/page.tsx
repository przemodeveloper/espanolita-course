import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { TaskPageContent } from "@/components/task-page-content";
import { QUERY_KEYS } from "@/queries/consts";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { loadAttempt } from "@/server/course/loadAttempt";
import { loadTask } from "@/server/course/loadTask";

export const metadata: Metadata = {
  title: "Zadanie - Matura Españolita",
  description: "Matura Españolita - Zadanie",
  keywords: ["zadania maturalne", "hiszpański", "españolita", "zadania"],
};

export default async function TaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const access = await requireCourseAccess();

  const queryClient = new QueryClient();

  if (!access.response) {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.TASK, taskId],
        queryFn: () => loadTask(taskId),
      }),
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.ATTEMPT, taskId],
        queryFn: () => loadAttempt(access.user.id, taskId),
      }),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskPageContent taskId={taskId} />
    </HydrationBoundary>
  );
}
