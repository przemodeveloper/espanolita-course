import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // latest attempt per task
  const attempts = await prisma.task_attempts_v2.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: "desc" },
    distinct: ["task_id"], // only latest
    select: {
      task_id: true,
      status: true,
    },
  });

  const completedTaskIds = new Set(
    attempts
      .filter(
        (a) => a.status === "graded" || a.status === "submitted",
      )
      .map((a) => a.task_id),
  );

  const items = await prisma.task_set_items_v2.findMany({
    select: {
      set_id: true,
      task_id: true,
      task_sets_v2: { select: { title: true } },
    },
  });

  const bySet = new Map<string, { title: string; taskIds: Set<string> }>();

  for (const row of items) {
    let entry = bySet.get(row.set_id);
    if (!entry) {
      entry = {
        title: row.task_sets_v2.title,
        taskIds: new Set(),
      };
      bySet.set(row.set_id, entry);
    }
    entry.taskIds.add(row.task_id);
  }

  const taskSets = Object.fromEntries(
    [...bySet.entries()].map(([setId, { title, taskIds }]) => {
      const ids = [...taskIds];
      const completedTasks = ids.filter((id) => completedTaskIds.has(id));
      return [
        setId,
        {
          taskSetId: setId,
          title,
          completedTasks,
          totalTasksCount: ids.length,
          completedTasksCount: completedTasks.length,
        },
      ];
    }),
  );

  return NextResponse.json({ taskSets });
}
