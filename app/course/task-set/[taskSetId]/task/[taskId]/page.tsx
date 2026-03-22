import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TaskPageContent } from "@/components/task-page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ taskId: string }>;
}): Promise<Metadata> {
  const { taskId } = await params;

  const task = await prisma.tasks_v2.findUnique({
    where: { id: taskId },
    select: {
      title: true,
    },
  });

  if (task) {
    return {
      title: `${task.title} - Kurs maturalny Españolita`,
      description: `Zadanie: ${task.title}`,
      keywords: [
        "kurs maturalny",
        "hiszpański",
        "matura",
        "españolita",
        "zadania",
        task.title,
      ],
    };
  }

  return {
    title: "Zadanie - Kurs maturalny Españolita",
    description: "Kurs maturalny Españolita - Zadanie",
    keywords: [
      "kurs maturalny",
      "hiszpański",
      "matura",
      "españolita",
      "zadania",
    ],
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
