import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server";

/**
 * Gate /course UI behind a verified Supabase user (getUser, not getSession).
 * Purchase entitlement is enforced in `app/course/layout.tsx` and v2 APIs
 * via `requireCourseAccess` (Node runtime / Prisma).
 */
export async function proxy(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL("/unauthorized", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/course", "/course/:path*"],
};
