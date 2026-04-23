import type { Metadata } from "next";
import { TaskPageContent } from "@/components/task-page-content";

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

  return <TaskPageContent taskId={taskId} />;
}
