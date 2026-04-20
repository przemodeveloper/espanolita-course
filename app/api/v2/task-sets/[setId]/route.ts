import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ setId: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
  }

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
