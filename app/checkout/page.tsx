import { CheckoutPageContent } from "@/components/checkout-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurs maturalny Españolita - Zakup kursu",
  description: "Zakup kursu",
  keywords: [
    "kurs maturalny",
    "hiszpański",
    "matura",
    "españolita",
    "zakup kursu",
  ],
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
