import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse("STRIPE_WEBHOOK_SECRET is not configured", {
      status: 500,
    });
  }

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Webhook verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 🎯 Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // 🔑 Fetch line items to get price_id
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        { limit: 1 },
      );

      const priceId = lineItems.data[0]?.price?.id;

      if (!priceId) {
        console.error("No price found for session:", session.id);
        return new NextResponse("Missing price", { status: 400 });
      }

      await prisma.purchases.upsert({
        where: {
          stripe_session_id: session.id,
        },
        update: {},
        create: {
          stripe_session_id: session.id,
          stripe_customer_id: session.customer as string | null,
          price_id: priceId,
          email: session.customer_details?.email ?? null,
        },
      });

      try {
        const emailRes = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/thank-you`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerEmail: session.customer_details?.email,
              customerName: session.customer_details?.name,
              courseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/register`,
            }),
          },
        );

        if (!emailRes.ok) {
          console.error("[Thank-you email] Failed:", await emailRes.text());
        }
      } catch (err) {
        console.error("[Thank-you email] Threw:", err);
      }

      console.log("✅ Purchase stored:", session.id);
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
