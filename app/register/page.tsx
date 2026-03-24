import { SignupForm } from "@/components/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejestracja - Kurs maturalny Españolita",
  description: "Zarejestruj się, aby rozpocząć naukę.",
  keywords: [
    "kurs maturalny",
    "hiszpański",
    "matura",
    "españolita",
    "rejestracja",
  ],
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] w-full">
      <SignupForm className="w-full max-w-md" />
    </div>
  );
}
