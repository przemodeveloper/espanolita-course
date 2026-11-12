import { NextResponse } from "next/server";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { loadTaskSets } from "@/server/course/loadTaskSets";

export async function GET() {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const result = await loadTaskSets();
  return NextResponse.json(result);
}
