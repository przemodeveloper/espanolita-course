import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { loadAttempt } from "@/server/course/loadAttempt";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const { taskId } = await params;
  const payload = await loadAttempt(access.user.id, taskId);
  return NextResponse.json(payload);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;
  const user = access.user;

  const { taskId } = await params;

  const latestAttempt = await prisma.task_attempts.findFirst({
    where: {
      task_id: taskId,
      user_id: user.id,
    },
    orderBy: { created_at: "desc" },
    select: { id: true },
  });

  if (!latestAttempt) {
    return NextResponse.json({ success: true });
  }

  await prisma.task_attempts.deleteMany({
    where: {
      id: latestAttempt.id,
      user_id: user.id,
    },
  });

  return NextResponse.json({ success: true });
}
