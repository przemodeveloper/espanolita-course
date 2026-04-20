import { ForgotPasswordForm } from "@/components/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zapomniałeś hasła - Matura Españolita",
  description: "Odzyskaj dostęp do konta — wyślemy link do resetu hasła.",
  keywords: [
    "zadania maturalne",
    "hiszpański",
    "españolita",
    "reset hasła",
    "zapomniałem hasła",
  ],
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] w-full">
      <ForgotPasswordForm className="w-full max-w-md" />
    </div>
  );
}
