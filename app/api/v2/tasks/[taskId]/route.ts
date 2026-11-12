import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const { taskId } = await params;

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
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const { task_set_items, ...taskBase } = task;
  const taskSetId = task_set_items[0]?.set_id ?? null;
  const taskSetTitle = task_set_items[0]?.task_sets?.title ?? null;

  if (task.type === "gap_fill_shared") {
    return NextResponse.json({
      ...taskBase,
      taskSetId,
      taskSetTitle,
      questions: task.questions.map((q) => ({
        id: q.id,
        order_index: q.order_index,
        prompt: q.prompt,
      })),
    });
  }

  return NextResponse.json({ ...taskBase, taskSetId, taskSetTitle });
}
