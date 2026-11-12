import { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import {
  buildPurchaseDataFromSession,
  upsertPurchaseFromCheckout,
} from "@/server/purchases/upsertFromCheckout";
import type Stripe from "stripe";

describe("buildPurchaseDataFromSession", () => {
  it("maps session metadata and customer details", () => {
    const session = {
      id: "cs_test_1",
      customer: "cus_1",
      customer_details: {
        email: "buyer@example.com",
        name: "Buyer",
      },
      metadata: {
        termsVersion: "v1.0",
        termsAcceptedAt: "2026-01-02T03:04:05.000Z",
        termsAcceptedIp: "1.2.3.4",
        termsUserAgent: "vitest",
      },
    } as unknown as Stripe.Checkout.Session;

    expect(buildPurchaseDataFromSession(session, "price_123")).toEqual({
      stripe_session_id: "cs_test_1",
      stripe_customer_id: "cus_1",
      price_id: "price_123",
      email: "buyer@example.com",
      terms_version: "v1.0",
      terms_accepted_at: new Date("2026-01-02T03:04:05.000Z"),
      terms_accepted_ip: "1.2.3.4",
      terms_user_agent: "vitest",
    });
  });
});

describe("upsertPurchaseFromCheckout", () => {
  it("returns created_or_noop on successful upsert", async () => {
    const db = {
      purchases: {
        upsert: vi.fn().mockResolvedValue({}),
        update: vi.fn(),
      },
    };

    const outcome = await upsertPurchaseFromCheckout(db as never, {
      stripe_session_id: "cs_1",
      stripe_customer_id: null,
      price_id: "price_1",
      email: "a@b.com",
      terms_version: "v1.0",
      terms_accepted_at: null,
      terms_accepted_ip: null,
      terms_user_agent: null,
    });

    expect(outcome).toBe("created_or_noop");
    expect(db.purchases.update).not.toHaveBeenCalled();
  });

  it("updates by email on unique email conflict", async () => {
    const conflict = new Prisma.PrismaClientKnownRequestError("conflict", {
      code: "P2002",
      clientVersion: "test",
    });
    const db = {
      purchases: {
        upsert: vi.fn().mockRejectedValue(conflict),
        update: vi.fn().mockResolvedValue({}),
      },
    };

    const purchaseData = {
      stripe_session_id: "cs_2",
      stripe_customer_id: null,
      price_id: "price_1",
      email: "dup@example.com",
      terms_version: "v1.0",
      terms_accepted_at: null,
      terms_accepted_ip: null,
      terms_user_agent: null,
    };

    const outcome = await upsertPurchaseFromCheckout(db as never, purchaseData);
    expect(outcome).toBe("updated_by_email");
    expect(db.purchases.update).toHaveBeenCalledWith({
      where: { email: "dup@example.com" },
      data: purchaseData,
    });
  });
});
