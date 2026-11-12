import { prisma } from "@/lib/prisma";

export async function loadTaskSets() {
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

  return sets.map((set) => ({
    id: set.id,
    title: set.title,
    tasks: set.task_set_items.map((i) => ({
      id: i.tasks.id,
      title: i.tasks.title,
    })),
    tasksCount: set.task_set_items.length,
  }));
}
