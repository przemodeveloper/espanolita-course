import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ setId: string }> },
) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const { setId: id } = await params;

  // Slim payload: set metadata + task list only (no nested questions/options).
  const taskSet = await prisma.task_sets.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      task_set_items: {
        orderBy: { order_index: "asc" },
        select: {
          tasks: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!taskSet) {
    return NextResponse.json(
      { error: "Zestaw zadań nie znaleziony" },
      { status: 404 },
    );
  }

  const tasks = taskSet.task_set_items.map((item) => item.tasks);

  return NextResponse.json({
    id: taskSet.id,
    title: taskSet.title,
    tasks,
  });
}
