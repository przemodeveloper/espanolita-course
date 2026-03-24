import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TaskPageContent } from "@/components/task-page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ taskId: string }>;
}): Promise<Metadata> {
  const { taskId } = await params;

  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: {
      title: true,
    },
  });

  if (task) {
    return {
      title: `${task.title} - Zadania Maturalne Españolita`,
      description: `Zadanie: ${task.title}`,
      keywords: [
        "zadania maturalne",
        "hiszpański",
        "españolita",
        "zadania",
        task.title,
      ],
    };
  }

  return {
    title: "Zadanie - Zadania Maturalne Españolita",
    description: "Zadania Maturalne Españolita - Zadanie",
    keywords: ["zadania maturalne", "hiszpański", "españolita", "zadania"],
  };
}

export default async function TaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  return <TaskPageContent taskId={taskId} />;
}
