"use client";

import { useCheckout } from "@/queries/useCheckout";

export default function CheckoutPage() {
  const { mutateAsync } = useCheckout();

  return (
    <button onClick={() => mutateAsync()} type="button">
      Kup kurs
    </button>
  );
}
