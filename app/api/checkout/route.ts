import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { CURRENT_TERMS_VERSION } from "@/lib/terms";

export async function POST(req: Request) {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_ID nie jest skonfigurowany" },
      { status: 500 },
    );
  }

  let body: { termsVersion?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane wejściowe" },
      { status: 400 },
    );
  }

  if (body.termsVersion !== CURRENT_TERMS_VERSION) {
    return NextResponse.json(
      { error: "Nieaktualna wersja regulaminu" },
      { status: 400 },
    );
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";
  const userAgent = h.get("user-agent")?.slice(0, 500) ?? "";
  const termsAcceptedAt = new Date().toISOString();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "blik"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    metadata: {
      product: "spanish-course",
      termsVersion: CURRENT_TERMS_VERSION,
      termsAcceptedAt,
      termsAcceptedIp: ip,
      termsUserAgent: userAgent,
    },
  });

  return NextResponse.json({ url: session.url });
}
