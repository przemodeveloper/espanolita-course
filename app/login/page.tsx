import { LoginForm } from "@/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logowanie - Zadania Maturalne Españolita",
  description: "Zaloguj się do swojego konta, aby rozpocząć naukę.",
  keywords: ["zadania maturalne", "hiszpański", "españolita", "logowanie"],
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] w-full">
      <LoginForm className="w-full max-w-md" />
    </div>
  );
}
