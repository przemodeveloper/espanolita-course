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

  const taskSet = await prisma.task_sets.findUnique({
    where: { id },
    include: {
      task_set_items: {
        orderBy: { order_index: "asc" },
        include: {
          tasks: {
            include: {
              questions: {
                orderBy: { order_index: "asc" },
                include: {
                  options: {
                    orderBy: { order_index: "asc" },
                  },
                },
              },
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

  // flatten items → tasks
  const tasks = taskSet.task_set_items.map((item) => item.tasks);

  return NextResponse.json({
    id: taskSet.id,
    title: taskSet.title,
    tasks,
  });
}
