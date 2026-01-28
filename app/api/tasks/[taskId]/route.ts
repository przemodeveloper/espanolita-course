import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {

  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const { taskId } = await params

  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      instructions: true,
      questions: {
        orderBy: { order_index: "asc" },
        select: {
          id: true,
          order_index: true,
          prompt: true,
          options: {
            select: {
              id: true,
              label: true,
              text: true
            }
          }
        }
      }
    }
  })

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(task)
}
