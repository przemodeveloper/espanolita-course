import { LandingPageContent } from "@/components/landing-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurs maturalny Españolita",
  description: "Kurs maturalny Españolita",
  keywords: ["kurs maturalny", "hiszpański", "matura", "españolita"],
};

export default function Home() {
  return <LandingPageContent />;
}
