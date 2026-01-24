import { prisma } from "@/lib/prisma"

export async function GET() {
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
