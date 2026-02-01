import { prisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tasks = await prisma.tasks_v2.findMany({
    orderBy: { created_at: "asc" },
    select: {
      id: true,
      title: true,
      instructions: true,
      type: true,
      questions_v2: {
        select: { id: true }
      }
    }
  })

  if (!tasks) {
    return Response.json({ error: "No tasks found" }, { status: 404 })
  }

  const result = tasks.map(task => ({
    id: task.id,
    title: task.title,
    instructions: task.instructions,
    questionCount: task.questions_v2.length,
  }))

  return Response.json(result)
}
