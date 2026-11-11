import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type CourseAccessOk = { user: User; response?: undefined };
export type CourseAccessDenied = { user?: undefined; response: NextResponse };
export type CourseAccessResult = CourseAccessOk | CourseAccessDenied;

/**
 * Requires a signed-in Supabase user who has claimed a purchase
 * (`purchases.user_id` matches the auth user).
 */
export async function requireCourseAccess(): Promise<CourseAccessResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      response: NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 }),
    };
  }

  const purchase = await prisma.purchases.findFirst({
    where: { user_id: user.id },
    select: { id: true },
  });

  if (!purchase) {
    return {
      response: NextResponse.json(
        { error: "Brak aktywnego dostępu do kursu." },
        { status: 403 },
      ),
    };
  }

  return { user };
}
