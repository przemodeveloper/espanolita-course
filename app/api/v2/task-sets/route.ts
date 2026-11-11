import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";

export async function GET() {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const sets = await prisma.task_sets.findMany({
    orderBy: { title: "asc" },
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
            },
          },
        },
      },
    },
  });

  if (!sets) {
    return NextResponse.json(
      { error: "Nie znaleziono zestawów zadań" },
      { status: 404 },
    );
  }

  const result = sets.map((set) => ({
    id: set.id,
    title: set.title,
    tasks: set.task_set_items.map((i) => ({
      id: i.tasks.id,
      title: i.tasks.title,
    })),
    tasksCount: set.task_set_items.length,
  }));

  return NextResponse.json(result);
}
