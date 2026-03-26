export async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    },
  );

  const text = await res.text();

  if (!res.ok) {
    console.error(
      "Turnstile verify HTTP error:",
      res.status,
      text.slice(0, 200),
    );
    return false;
  }

  try {
    const data = JSON.parse(text) as { success?: boolean };
    return data.success === true;
  } catch {
    console.error("Turnstile verify: response was not valid JSON");
    return false;
  }
}
