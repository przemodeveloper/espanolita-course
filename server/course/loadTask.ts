import { prisma } from "@/lib/prisma";
import { resolveHeadingMatchHeadings } from "@/server/course/resolveHeadings";
import { DomainError } from "@/server/errors";

export async function loadTask(taskId: string) {
  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      instructions: true,
      content: true,
      type: true,
      task_set_items: {
        take: 1,
        orderBy: { set_id: "asc" },
        select: {
          set_id: true,
          task_sets: { select: { title: true } },
        },
      },
      questions: {
        orderBy: { order_index: "asc" },
        select: {
          id: true,
          order_index: true,
          prompt: true,
          options: {
            orderBy: { order_index: "asc" },
            select: {
              id: true,
              label: true,
              text: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new DomainError("Task not found", 404);
  }

  const { task_set_items, ...taskBase } = task;
  const taskSetId = task_set_items[0]?.set_id ?? null;
  const taskSetTitle = task_set_items[0]?.task_sets?.title ?? null;
  const content =
    task.content && typeof task.content === "object"
      ? (task.content as Record<string, unknown>)
      : {};

  if (task.type === "gap_fill_shared") {
    return {
      ...taskBase,
      content,
      taskSetId,
      taskSetTitle,
      questions: task.questions.map((q) => ({
        id: q.id,
        order_index: q.order_index,
        prompt: q.prompt,
      })),
    };
  }

  if (task.type === "heading_match") {
    const headings = resolveHeadingMatchHeadings(
      content as {
        headings?: { label: string; text: string }[];
        options?: { label?: string | null; text?: string | null }[];
      },
      task.questions,
    );
    if (headings.length === 0) {
      throw new DomainError(
        "Zadanie heading_match nie ma banku nagłówków (content.headings / options).",
        500,
      );
    }
    return {
      ...taskBase,
      content: { ...content, headings },
      taskSetId,
      taskSetTitle,
      questions: task.questions.map((q) => ({
        id: q.id,
        order_index: q.order_index,
        prompt: q.prompt,
        options: [],
      })),
    };
  }

  const needsOptions =
    task.type === "single_choice" || task.type === "audio_single_choice";

  return {
    ...taskBase,
    content,
    taskSetId,
    taskSetTitle,
    questions: task.questions.map((q) => ({
      id: q.id,
      order_index: q.order_index,
      prompt: q.prompt,
      options: needsOptions ? q.options : [],
    })),
  };
}
