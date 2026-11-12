import { prisma } from "@/lib/prisma";

export type ProgressPayload = {
  taskSets: Record<
    string,
    {
      taskSetId: string;
      title: string;
      completedTasks: string[];
      totalTasksCount: number;
      completedTasksCount: number;
    }
  >;
};

export async function loadProgress(
  userId: string,
  setId?: string,
): Promise<ProgressPayload> {
  const attempts = await prisma.task_attempts.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    distinct: ["task_id"],
    select: {
      task_id: true,
      status: true,
    },
  });

  const completedTaskIds = new Set(
    attempts
      .filter((a) => a.status === "graded" || a.status === "submitted")
      .map((a) => a.task_id),
  );

  const items = await prisma.task_set_items.findMany({
    where: setId ? { set_id: setId } : undefined,
    select: {
      set_id: true,
      task_id: true,
      task_sets: { select: { title: true } },
    },
  });

  const bySet = new Map<string, { title: string; taskIds: Set<string> }>();

  for (const row of items) {
    let entry = bySet.get(row.set_id);
    if (!entry) {
      entry = {
        title: row.task_sets.title,
        taskIds: new Set(),
      };
      bySet.set(row.set_id, entry);
    }
    entry.taskIds.add(row.task_id);
  }

  const taskSets = Object.fromEntries(
    [...bySet.entries()].map(([id, { title, taskIds }]) => {
      const ids = [...taskIds];
      const completedTasks = ids.filter((taskId) =>
        completedTaskIds.has(taskId),
      );
      return [
        id,
        {
          taskSetId: id,
          title,
          completedTasks,
          totalTasksCount: ids.length,
          completedTasksCount: completedTasks.length,
        },
      ];
    }),
  );

  return { taskSets };
}
