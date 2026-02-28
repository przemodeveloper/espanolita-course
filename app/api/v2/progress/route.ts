import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // latest attempt per task
  const attempts = await prisma.task_attempts_v2.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: "desc" },
    distinct: ["task_id"], // only latest
    select: {
      task_id: true,
      id: true,
      score: true,
      status: true,
    },
  });

  const progress = Object.fromEntries(
    attempts.map((a) => [
      a.task_id,
      {
        completed: a.status === "graded" || a.status === "submitted",
        score: a.score,
        attemptId: a.id,
      },
    ]),
  );

  return NextResponse.json(progress);
}
