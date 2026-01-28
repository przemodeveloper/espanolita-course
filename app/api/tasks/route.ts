import { prisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tasks = await prisma.tasks.findMany({
    orderBy: { created_at: "asc" },
    select: {
      id: true,
      title: true,
      instructions: true,
      questions: {
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
    questionCount: task.questions.length,
  }))

  return Response.json(result)
}
