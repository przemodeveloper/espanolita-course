import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

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

        const metadata = session.metadata ?? {};
        const termsAcceptedAt = metadata.termsAcceptedAt
          ? new Date(metadata.termsAcceptedAt)
          : null;

        const email = session.customer_details?.email ?? null;

        const purchaseData = {
          stripe_session_id: session.id,
          stripe_customer_id: session.customer as string | null,
          price_id: priceId,
          email,
          terms_version: metadata.termsVersion ?? null,
          terms_accepted_at:
            termsAcceptedAt && !Number.isNaN(termsAcceptedAt.getTime())
              ? termsAcceptedAt
              : null,
          terms_accepted_ip: metadata.termsAcceptedIp ?? null,
          terms_user_agent: metadata.termsUserAgent || null,
        };

        try {
          await prisma.purchases.upsert({
            where: { stripe_session_id: session.id },
            update: {},
            create: purchaseData,
          });
        } catch (err) {
          // The `email` column on `purchases` has a UNIQUE constraint, so a
          // returning customer (or repeated test) with the same email would
          // otherwise crash the webhook forever. Recover by updating the
          // existing row to reflect the latest paid session.
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002" &&
            email
          ) {
            console.warn(
              `[stripe-webhook] duplicate email ${email}, updating existing purchase row`,
            );
            await prisma.purchases.update({
              where: { email },
              data: purchaseData,
            });
          } else {
            throw err;
          }
        }

        try {
          const emailRes = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/thank-you`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerEmail: session.customer_details?.email,
                customerName: session.customer_details?.name,
                courseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/register`,
              }),
            },
          );

          if (!emailRes.ok) {
            console.error(
              "[stripe-webhook] thank-you email failed:",
              await emailRes.text(),
            );
          }
        } catch (err) {
          console.error("[stripe-webhook] thank-you email threw:", err);
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
    // Returning 500 lets Stripe retry; if the failure is deterministic,
    // retries won't help, but the logs above will tell you why.
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
