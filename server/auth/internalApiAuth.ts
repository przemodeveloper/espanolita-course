/**
 * Fail-closed check for internal HTTP endpoints (e.g. thank-you email).
 * Expects header `x-internal-api-secret` to match `INTERNAL_API_SECRET`.
 */
export function assertInternalApiSecret(
  req: Request,
): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.INTERNAL_API_SECRET;
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error: "INTERNAL_API_SECRET nie jest skonfigurowany",
    };
  }

  const provided = req.headers.get("x-internal-api-secret");
  if (!provided || provided !== expected) {
    return { ok: false, status: 401, error: "Nieautoryzowany" };
  }

  return { ok: true };
}
