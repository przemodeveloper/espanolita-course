import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Płatność nie powiodła się - Matura Españolita",
  description: "Płatność nie powiodła się.",
  keywords: [
    "kurs maturalny",
    "hiszpański",
    "matura",
    "espanolita",
    "españolita",
    "płatność",
  ],
};

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">Płatność nie powiodła się 💔</h1>
      <p className="text-lg text-center text-muted-foreground mb-4">
        Płatność nie powiodła się. Spróbuj ponownie.
      </p>
    </div>
  );
}
