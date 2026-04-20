import { ResetPasswordForm } from "@/components/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset hasła - Matura Españolita",
  description: "Ustaw nowe hasło do swojego konta.",
  keywords: ["zadania maturalne", "hiszpański", "españolita", "reset hasła"],
};

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] w-full">
      <ResetPasswordForm className="w-full max-w-md" />
    </div>
  );
}
