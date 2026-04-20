import { LandingPageContent } from "@/components/landing-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matura Españolita",
  description: "Matura Españolita",
  keywords: ["matura", "hiszpański", "españolita"],
};

export default function Home() {
  return <LandingPageContent />;
}
