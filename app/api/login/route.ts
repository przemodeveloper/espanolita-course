import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile/verifyTurnstile";

export async function POST(req: Request) {
  try {
    const { email, password, turnstileToken } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i hasło są wymagane." },
        { status: 400 },
      );
    }

    // Verify Turnstile before touching auth
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Brak tokenu sprawdzania zabezpieczeń." },
        { status: 400 },
      );
    }

    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        {
          error: "Sprawdzanie zabezpieczeń nie powiodło się. Spróbuj ponownie.",
        },
        { status: 403 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd podczas logowania." },
      { status: 500 },
    );
  }
}
