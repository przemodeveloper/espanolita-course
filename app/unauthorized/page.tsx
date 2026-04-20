import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brak dostępu - Zadania Maturalne Españolita",
  description: "Brak dostępu do tej strony.",
  keywords: ["zadania maturalne", "hiszpański", "españolita", "brak dostępu"],
};

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">Nie jesteś zalogowany</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Aby uzyskać dostęp do tej strony, musisz się zalogować.
      </p>
      <Button asChild variant="outline">
        <Link href="/login">Zaloguj się</Link>
      </Button>
    </div>
  );
}
