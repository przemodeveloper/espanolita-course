import { NextResponse } from "next/server";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { loadAttempt } from "@/server/course/loadAttempt";
import { loadProgress } from "@/server/course/loadProgress";
import { loadTask } from "@/server/course/loadTask";
import { loadTaskSets } from "@/server/course/loadTaskSets";
import { isDomainError } from "@/server/errors";

/**
 * Single payload for course shell + optional current task.
 * Prefer RSC HydrationBoundary for first paint; this helps client navigations.
 */
export async function GET(req: Request) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const url = new URL(req.url);
  const taskId = url.searchParams.get("taskId") ?? undefined;

  try {
    const [taskSets, progress, task, attempt] = await Promise.all([
      loadTaskSets(),
      loadProgress(access.user.id),
      taskId ? loadTask(taskId) : Promise.resolve(null),
      taskId ? loadAttempt(access.user.id, taskId) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      taskSets,
      progress,
      task,
      attempt,
    });
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
