import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
    }

    const redirectUrl = new URL("/unauthorized", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/course/:path*", "/course/task/:path*"],
};
