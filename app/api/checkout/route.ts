import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!, // ← your Stripe price ID
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    metadata: {
      product: "spanish-course",
    },
  });

  return NextResponse.json({ url: session.url });
}
