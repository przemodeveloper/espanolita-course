import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    purchases: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/supabase/admin", () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        getUserById: vi.fn(),
        createUser: vi.fn(),
        deleteUser: vi.fn(),
      },
    },
    from: vi.fn(),
  },
}));

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { registerWithPurchase } from "@/server/auth/registerWithPurchase";
import { DomainError } from "@/server/errors";

describe("registerWithPurchase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when no purchase exists for email", async () => {
    vi.mocked(prisma.purchases.findFirst).mockResolvedValue(null);

    await expect(
      registerWithPurchase({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        password: "password12",
      }),
    ).rejects.toMatchObject({
      status: 403,
      message: expect.stringMatching(/zakupu/i),
    } satisfies Partial<DomainError>);
  });

  it("creates auth user and claims purchase", async () => {
    vi.mocked(prisma.purchases.findFirst).mockResolvedValue({
      id: "purchase-1",
      user_id: null,
    } as never);

    const fromMock = vi.fn().mockImplementation((table: string) => {
      if (table === "purchases") {
        return {
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      return {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };
    });
    vi.mocked(supabaseAdmin.from).mockImplementation(fromMock as never);

    vi.mocked(supabaseAdmin.auth.admin.createUser).mockResolvedValue({
      data: {
        user: { id: "user-1", email: "ada@example.com" },
      },
      error: null,
    } as never);

    const result = await registerWithPurchase({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "Ada@Example.com",
      password: "password12",
    });

    expect(result.user).toEqual({
      id: "user-1",
      email: "ada@example.com",
      first_name: "Ada",
      last_name: "Lovelace",
    });
    expect(supabaseAdmin.auth.admin.createUser).toHaveBeenCalled();
  });
});
