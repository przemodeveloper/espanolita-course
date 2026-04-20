import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile/verifyTurnstile";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, turnstileToken } =
      await req.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Brak wymaganych pól." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Hasło musi mieć co najmniej 8 znaków." },
        { status: 400 },
      );
    }

    // Verify Turnstile before any DB work
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Brak tokenu sprawdzania zabezpieczeń." },
        { status: 400 },
      );
    }

    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        {
          error: "Sprawdzanie zabezpieczeń nie powiodło się. Spróbuj ponownie.",
        },
        { status: 403 },
      );
    }

    // 1️⃣ Check purchase exists & not claimed (case-insensitive email)
    const purchase = await prisma.purchases.findFirst({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        {
          error:
            "Nie znaleziono prawidłowego zakupu dla tej poczty elektronicznej.",
        },
        { status: 403 },
      );
    }

    // 2️⃣ If purchase has a user_id, verify the auth user actually exists
    if (purchase.user_id) {
      const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(
        purchase.user_id,
      );

      if (existingUser.user) {
        return NextResponse.json(
          {
            error:
              "Konto z tą pocztą elektroniczną już istnieje. Zaloguj się zamiast tego.",
          },
          { status: 409 },
        );
      }

      // Auth user was deleted but purchase wasn't cleaned up — reset it
      await supabaseAdmin
        .from("purchases")
        .update({ user_id: null, claimed_at: null })
        .eq("id", purchase.id);
    }

    // 3️⃣ Create user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
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
      const msg = authError.message.toLowerCase();
      const duplicateEmail =
        msg.includes("already been registered") ||
        msg.includes("already registered") ||
        msg.includes("user already exists") ||
        msg.includes("duplicate");
      if (duplicateEmail) {
        return NextResponse.json(
          {
            error:
              "An account with this email already exists. Please sign in instead.",
          },
          { status: 409 },
        );
      }
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
        { error: "Nie udało się połączyć zakupu. Spróbuj ponownie." },
        { status: 500 },
      );
    }

    // 4️⃣ Optionally create user profile
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
      { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
