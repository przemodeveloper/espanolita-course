import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurs maturalny Españolita - Płatność nie powiodła się",
  description: "Płatność zakończona nie powiodła się.",
  keywords: [
    "kurs maturalny",
    "hiszpański",
    "matura",
    "españolita",
    "płatność",
  ],
};

export default function CancelPage() {
  return <h1>Płatność zakończona niepowodzeniem 💔</h1>;
}
