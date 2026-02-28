import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  const taskSet = await prisma.task_sets_v2.findUnique({
    where: { id },
    include: {
      task_set_items_v2: {
        orderBy: { order_index: "asc" },
        include: {
          tasks_v2: {
            include: {
              questions_v2: {
                orderBy: { order_index: "asc" },
                include: {
                  options_v2: {
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
    return NextResponse.json({ error: "Task set not found" }, { status: 404 });
  }

  // flatten items → tasks
  const tasks = taskSet.task_set_items_v2.map((item) => item.tasks_v2);

  return NextResponse.json({
    id: taskSet.id,
    title: taskSet.title,
    tasks,
  });
}
