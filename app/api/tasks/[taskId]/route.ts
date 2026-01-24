import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
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
