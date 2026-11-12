import { cache } from "react";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { getUserCached } from "@/server/auth/getUserCached";

export type CourseAccessOk = { user: User; response?: undefined };
export type CourseAccessDenied = { user?: undefined; response: NextResponse };
export type CourseAccessResult = CourseAccessOk | CourseAccessDenied;

const getPurchaseIdForUser = cache(async (userId: string) => {
  const purchase = await prisma.purchases.findFirst({
    where: { user_id: userId },
    select: { id: true },
  });
  return purchase?.id ?? null;
});

/**
 * Requires a signed-in Supabase user who has claimed a purchase
 * (`purchases.user_id` matches the auth user).
 * Auth + purchase lookups are request-memoized via React `cache()`.
 */
export async function requireCourseAccess(): Promise<CourseAccessResult> {
  const user = await getUserCached();

  if (!user) {
    return {
      response: NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 }),
    };
  }

  const purchaseId = await getPurchaseIdForUser(user.id);

  if (!purchaseId) {
    return {
      response: NextResponse.json(
        { error: "Brak aktywnego dostępu do kursu." },
        { status: 403 },
      ),
    };
  }

  return { user };
}
