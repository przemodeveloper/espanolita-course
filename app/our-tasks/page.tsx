import { OurTasksPageContent } from "@/components/our-tasks-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nasze zadania - Zadania Maturalne Españolita",
  description:
    "Poznaj zadania maturalne z hiszpańskiego — materiały Españolita dopasowane do matury.",
  keywords: ["zadania maturalne", "hiszpański", "españolita", "arkusz"],
};

export default function OurTasksPage() {
  return <OurTasksPageContent />;
}
