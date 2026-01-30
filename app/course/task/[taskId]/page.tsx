import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Question } from "@/models/task";

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
  const questions = (await prisma.questions.findMany({
    where: { task_id: taskId },
    select: {
      id: true,
      order_index: true,
      prompt: true,
      options: {
        select: { id: true, label: true, text: true },
      },
    },
  })) as Question[];

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <h3>{question?.prompt?.lines?.join(" ")}</h3>
          <p>{question.options.map((option) => option.text).join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
