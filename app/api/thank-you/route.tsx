import { NextResponse } from "next/server";
import { assertInternalApiSecret } from "@/server/auth/internalApiAuth";
import { sendThankYouEmail } from "@/server/email/sendThankYouEmail";
import { isDomainError } from "@/server/errors";
import {
  thankYouBodySchema,
  zodErrorMessage,
} from "@/server/validation/schemas";

export async function POST(req: Request) {
  const auth = assertInternalApiSecret(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON" }, { status: 400 });
  }

  const parsed = thankYouBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: zodErrorMessage(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const data = await sendThankYouEmail(parsed.data);
    return NextResponse.json({ data });
  } catch (err) {
    if (isDomainError(err)) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[thank-you]", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać e-maila" },
      { status: 500 },
    );
  }
}
