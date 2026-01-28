import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Płatność nie powiodła się - Kurs maturalny Españolita",
  description: "Płatność nie powiodła się.",
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
