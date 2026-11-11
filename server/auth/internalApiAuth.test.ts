import { afterEach, describe, expect, it } from "vitest";
import { assertInternalApiSecret } from "@/server/auth/internalApiAuth";

describe("assertInternalApiSecret", () => {
  const original = process.env.INTERNAL_API_SECRET;

  afterEach(() => {
    if (original === undefined) delete process.env.INTERNAL_API_SECRET;
    else process.env.INTERNAL_API_SECRET = original;
  });

  it("fails closed when secret env is missing", () => {
    delete process.env.INTERNAL_API_SECRET;
    const req = new Request("http://localhost/api/thank-you", {
      method: "POST",
    });
    expect(assertInternalApiSecret(req)).toEqual({
      ok: false,
      status: 503,
      error: "INTERNAL_API_SECRET nie jest skonfigurowany",
    });
  });

  it("rejects missing or wrong header", () => {
    process.env.INTERNAL_API_SECRET = "test-secret";
    const missing = new Request("http://localhost/api/thank-you", {
      method: "POST",
    });
    expect(assertInternalApiSecret(missing).ok).toBe(false);

    const wrong = new Request("http://localhost/api/thank-you", {
      method: "POST",
      headers: { "x-internal-api-secret": "nope" },
    });
    expect(assertInternalApiSecret(wrong)).toEqual({
      ok: false,
      status: 401,
      error: "Nieautoryzowany",
    });
  });

  it("accepts matching header", () => {
    process.env.INTERNAL_API_SECRET = "test-secret";
    const req = new Request("http://localhost/api/thank-you", {
      method: "POST",
      headers: { "x-internal-api-secret": "test-secret" },
    });
    expect(assertInternalApiSecret(req)).toEqual({ ok: true });
  });
});
