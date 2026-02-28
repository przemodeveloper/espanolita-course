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

  const sets = await prisma.task_sets_v2.findMany({
    orderBy: { title: "asc" },

    select: {
      id: true,
      title: true,

      task_set_items_v2: {
        orderBy: { order_index: "asc" },

        select: {
          tasks_v2: {
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
    return NextResponse.json({ error: "No task sets found" }, { status: 404 });
  }

  const result = sets.map((set) => ({
    id: set.id,
    title: set.title,

    tasks: set.task_set_items_v2.map((i) => ({
      id: i.tasks_v2.id,
      title: i.tasks_v2.title,
    })),

    tasksCount: set.task_set_items_v2.length,
  }));

  return NextResponse.json(result);
}
