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
    return NextResponse.json({ error: "No task sets found" }, { status: 404 });
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
