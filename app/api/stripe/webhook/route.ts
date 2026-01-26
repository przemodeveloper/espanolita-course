import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Webhook verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 🎯 Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Payment completed for:", session.customer_email);

      // TODO: unlock access here
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
