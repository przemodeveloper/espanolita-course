import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kurs maturalny Españolita - Płatność zakończona sukcesem",
  description: "Płatność zakończona sukcesem.",
  keywords: [
    "kurs maturalny",
    "hiszpański",
    "matura",
    "españolita",
    "płatność",
    "sukces",
  ],
};

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Płatność zakończona sukcesem 🎉</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Dziękujemy za kupienie kursu. Możesz teraz zarejestrować się klikając na
        poniższy przycisk.
      </p>
      <Button asChild variant="outline">
        <Link href="/register">Zarejestruj się</Link>
      </Button>
    </div>
  );
}
