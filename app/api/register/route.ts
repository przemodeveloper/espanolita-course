import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function verifyTurnstile(token: string): Promise<boolean> {
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

  const data = await res.json();
  return data.success === true;
}

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, turnstileToken } =
      await req.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    // Verify Turnstile before any DB work
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security check token is missing." },
        { status: 400 },
      );
    }

    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Security check failed. Please try again." },
        { status: 403 },
      );
    }

    // 1️⃣ Check purchase exists & not claimed
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from("purchases")
      .select("*")
      .eq("email", email)
      .is("user_id", null)
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: "No valid purchase found for this email." },
        { status: 403 },
      );
    }

    // 3️⃣ Create user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          purchase_id: purchase.id,
          registered_at: new Date().toISOString(),
        },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("purchases")
      .update({
        user_id: authData.user.id,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", purchase.id);

    if (updateError) {
      // Rollback: delete the user if purchase claim fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      console.error("Purchase update error:", updateError);
      return NextResponse.json(
        { error: "Failed to link purchase. Please try again." },
        { status: 500 },
      );
    }

    // 5️⃣ Optionally create user profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Don't fail the request, profile can be created later
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
