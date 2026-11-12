import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile/verifyTurnstile";
import { registerWithPurchase } from "@/server/auth/registerWithPurchase";
import { isDomainError } from "@/server/errors";
import {
  registerBodySchema,
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

    const parsed = registerBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: zodErrorMessage(parsed.error) },
        { status: 400 },
      );
    }

    const isHuman = await verifyTurnstile(parsed.data.turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        {
          error: "Sprawdzanie zabezpieczeń nie powiodło się. Spróbuj ponownie.",
        },
        { status: 403 },
      );
    }

    const result = await registerWithPurchase({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    if (isDomainError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
