import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DomainError } from "@/server/errors";

export type RegisterWithPurchaseInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterWithPurchaseResult = {
  user: {
    id: string;
    email: string | undefined;
    first_name: string;
    last_name: string;
  };
};

export async function registerWithPurchase(
  input: RegisterWithPurchaseInput,
): Promise<RegisterWithPurchaseResult> {
  const normalizedEmail = input.email.toLowerCase().trim();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();

  const purchase = await prisma.purchases.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
    },
  });

  if (!purchase) {
    throw new DomainError(
      "Nie znaleziono prawidłowego zakupu dla tej poczty elektronicznej.",
      403,
    );
  }

  if (purchase.user_id) {
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(
      purchase.user_id,
    );

    if (existingUser.user) {
      throw new DomainError(
        "Konto z tą pocztą elektroniczną już istnieje. Zaloguj się zamiast tego.",
        409,
      );
    }

    await supabaseAdmin
      .from("purchases")
      .update({ user_id: null, claimed_at: null })
      .eq("id", purchase.id);
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        purchase_id: purchase.id,
        registered_at: new Date().toISOString(),
      },
    });

  if (authError) {
    const msg = authError.message.toLowerCase();
    const duplicateEmail =
      msg.includes("already been registered") ||
      msg.includes("already registered") ||
      msg.includes("user already exists") ||
      msg.includes("duplicate");
    if (duplicateEmail) {
      throw new DomainError(
        "An account with this email already exists. Please sign in instead.",
        409,
      );
    }
    throw new DomainError(authError.message, 400);
  }

  const { error: updateError } = await supabaseAdmin
    .from("purchases")
    .update({
      user_id: authData.user.id,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", purchase.id);

  if (updateError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw new DomainError(
      "Nie udało się połączyć zakupu. Spróbuj ponownie.",
      500,
    );
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authData.user.id,
    email: authData.user.email,
    first_name: firstName,
    last_name: lastName,
    created_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error("Profile creation error:", profileError);
  }

  return {
    user: {
      id: authData.user.id,
      email: authData.user.email,
      first_name: firstName,
      last_name: lastName,
    },
  };
}
