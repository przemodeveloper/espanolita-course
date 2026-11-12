import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile/verifyTurnstile";
import {
  loginBodySchema,
  zodErrorMessage,
} from "@/server/validation/schemas";

export async function POST(req: Request) {
  try {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Nieprawidłowe dane wejściowe" },
        { status: 400 },
      );
    }

    const parsed = loginBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: zodErrorMessage(parsed.error) },
        { status: 400 },
      );
    }

    const { email, password, turnstileToken } = parsed.data;

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
