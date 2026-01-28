import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 🔐 NOT LOGGED IN
  if (!user) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redirectUrl = new URL("/unauthorized", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/course/:path*", "/course/task/:path*"],
};
