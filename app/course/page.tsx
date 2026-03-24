import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zadania - Zadania Maturalne Españolita",
  description: "Zadania - Zadania Maturalne Españolita",
  keywords: ["zadania maturalne", "hiszpański", "españolita", "zadania"],
};

export default function CoursePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full">
      <h1 className="text-2xl font-bold">Zadania Maturalne Españolita</h1>
      <p className="text-lg text-muted-foreground">
        Aby rozpocząć kurs, kliknij na jedno z zadań po lewej stronie.
      </p>
    </div>
  );
}
