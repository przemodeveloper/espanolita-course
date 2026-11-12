import { describe, expect, it } from "vitest";
import {
  checkoutBodySchema,
  loginBodySchema,
  registerBodySchema,
  submitBodySchema,
  thankYouBodySchema,
} from "@/server/validation/schemas";

describe("validation schemas", () => {
  it("accepts valid login bodies and rejects missing turnstile", () => {
    expect(
      loginBodySchema.safeParse({
        email: "a@b.com",
        password: "secret",
        turnstileToken: "tok",
      }).success,
    ).toBe(true);

    const bad = loginBodySchema.safeParse({
      email: "a@b.com",
      password: "secret",
    });
    expect(bad.success).toBe(false);
  });

  it("enforces register password length", () => {
    const bad = registerBodySchema.safeParse({
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      password: "short",
      turnstileToken: "tok",
    });
    expect(bad.success).toBe(false);
  });

  it("requires current terms version on checkout", () => {
    expect(checkoutBodySchema.safeParse({ termsVersion: "v0" }).success).toBe(
      false,
    );
    expect(
      checkoutBodySchema.safeParse({ termsVersion: "v1.0" }).success,
    ).toBe(true);
  });

  it("requires at least one submit answer", () => {
    expect(submitBodySchema.safeParse({ answers: [] }).success).toBe(false);
    expect(
      submitBodySchema.safeParse({
        answers: [
          {
            questionId: "550e8400-e29b-41d4-a716-446655440000",
            optionId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          },
        ],
      }).success,
    ).toBe(true);
  });

  it("validates thank-you payload", () => {
    expect(
      thankYouBodySchema.safeParse({
        customerEmail: "a@b.com",
        courseUrl: "https://example.com/register",
      }).success,
    ).toBe(true);
  });
});
