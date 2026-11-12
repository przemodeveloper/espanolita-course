import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCourseAccess } from "@/server/auth/requireCourseAccess";
import { isDomainError } from "@/server/errors";
import { submitTaskAnswers } from "@/server/tasks/submitTask";
import {
  submitBodySchema,
  zodErrorMessage,
} from "@/server/validation/schemas";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const access = await requireCourseAccess();
  if (access.response) return access.response;

  const { taskId } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane wejściowe" },
      { status: 400 },
    );
  }

  const parsed = submitBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: zodErrorMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction((tx) =>
      submitTaskAnswers(tx, {
        userId: access.user.id,
        taskId,
        answers: parsed.data.answers,
      }),
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    if (isDomainError(err)) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: "Nie udało się złożyć zgłoszenia" },
      { status: 500 },
    );
  }
}
