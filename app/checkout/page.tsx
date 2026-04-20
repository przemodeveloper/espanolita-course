import { CheckoutPageContent } from "@/components/checkout-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zakup zadań maturalnych - Zadania Maturalne Españolita",
  description: "Dokonaj zakupu zadań maturalnych Españolita",
  keywords: ["zadania maturalne", "hiszpański", "españolita", "zakup zadań"],
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
