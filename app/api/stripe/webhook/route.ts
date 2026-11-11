import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendThankYouEmail } from "@/server/email/sendThankYouEmail";
import {
  buildPurchaseDataFromSession,
  upsertPurchaseFromCheckout,
} from "@/server/purchases/upsertFromCheckout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set");
    return new NextResponse("STRIPE_WEBHOOK_SECRET nie jest skonfigurowany", {
      status: 500,
    });
  }

  if (!signature) {
    return new NextResponse("Brak podpisu", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(
      "[stripe-webhook] signature verification failed:",
      error.message,
    );
    return new NextResponse(`Błąd webhook: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        // For async methods (BLIK/SEPA), `completed` fires before payment is confirmed.
        // Only persist once we know the money is actually in.
        if (session.payment_status !== "paid") {
          console.log(
            `[stripe-webhook] ${event.type} ignored, payment_status=${session.payment_status}, session=${session.id}`,
          );
          return NextResponse.json({ received: true });
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { limit: 1 },
        );

        const priceId = lineItems.data[0]?.price?.id;
        if (!priceId) {
          console.error(
            `[stripe-webhook] missing price for session ${session.id}`,
          );
          return new NextResponse("Missing price", { status: 400 });
        }

        const purchaseData = buildPurchaseDataFromSession(session, priceId);
        const outcome = await upsertPurchaseFromCheckout(prisma, purchaseData);
        if (outcome === "updated_by_email") {
          console.warn(
            `[stripe-webhook] duplicate email ${purchaseData.email}, updating existing purchase row`,
          );
        }

        try {
          const customerEmail = session.customer_details?.email;
          if (customerEmail) {
            await sendThankYouEmail({
              customerEmail,
              customerName: session.customer_details?.name ?? undefined,
              courseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/register`,
            });
          }
        } catch (err) {
          console.error("[stripe-webhook] thank-you email failed:", err);
        }

        console.log(
          `[stripe-webhook] purchase stored: session=${session.id} event=${event.type}`,
        );
        break;
      }

      default:
        console.log(`[stripe-webhook] unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(
      `[stripe-webhook] handler crashed for event ${event.id} (${event.type}):`,
      err,
    );
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
