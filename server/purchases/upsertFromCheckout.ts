import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import type Stripe from "stripe";

export type PurchaseUpsertInput = {
  stripe_session_id: string;
  stripe_customer_id: string | null;
  price_id: string;
  email: string | null;
  terms_version: string | null;
  terms_accepted_at: Date | null;
  terms_accepted_ip: string | null;
  terms_user_agent: string | null;
};

export function buildPurchaseDataFromSession(
  session: Stripe.Checkout.Session,
  priceId: string,
): PurchaseUpsertInput {
  const metadata = session.metadata ?? {};
  const termsAcceptedAt = metadata.termsAcceptedAt
    ? new Date(metadata.termsAcceptedAt)
    : null;

  return {
    stripe_session_id: session.id,
    stripe_customer_id: (session.customer as string | null) ?? null,
    price_id: priceId,
    email: session.customer_details?.email ?? null,
    terms_version: metadata.termsVersion ?? null,
    terms_accepted_at:
      termsAcceptedAt && !Number.isNaN(termsAcceptedAt.getTime())
        ? termsAcceptedAt
        : null,
    terms_accepted_ip: metadata.termsAcceptedIp ?? null,
    terms_user_agent: metadata.termsUserAgent || null,
  };
}

/**
 * Idempotent purchase write for Stripe checkout.session paid events.
 * Handles unique email conflicts by updating the existing row.
 */
export async function upsertPurchaseFromCheckout(
  db: Pick<PrismaClient, "purchases">,
  purchaseData: PurchaseUpsertInput,
): Promise<"created_or_noop" | "updated_by_email"> {
  try {
    await db.purchases.upsert({
      where: { stripe_session_id: purchaseData.stripe_session_id },
      update: {},
      create: purchaseData,
    });
    return "created_or_noop";
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002" &&
      purchaseData.email
    ) {
      await db.purchases.update({
        where: { email: purchaseData.email },
        data: purchaseData,
      });
      return "updated_by_email";
    }
    throw err;
  }
}
