import { NextResponse } from "next/server";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { loadProgress } from "@/server/course/loadProgress";

export async function GET(req: Request) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const setId = new URL(req.url).searchParams.get("setId") ?? undefined;
  const progress = await loadProgress(access.user.id, setId);
  return NextResponse.json(progress);
}
