import { NextResponse } from "next/server";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { loadTask } from "@/server/course/loadTask";
import { isDomainError } from "@/server/errors";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const { taskId } = await params;

  try {
    const task = await loadTask(taskId);
    return NextResponse.json(task);
  } catch (err) {
    if (isDomainError(err)) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status },
      );
    }
    throw err;
  }
}
