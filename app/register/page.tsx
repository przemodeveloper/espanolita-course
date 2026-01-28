import { SignupForm } from "@/components/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurs maturalny Españolita - Rejestracja",
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
    <div className="flex items-center justify-center h-screen">
      <SignupForm className="w-full max-w-md" />
    </div>
  );
}
