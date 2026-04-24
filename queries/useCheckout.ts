import { useMutation } from "@tanstack/react-query";
import { postCheckout } from "@/services/checkout.service";

export const useCheckout = () => {
  const mutation = useMutation({
    mutationFn: ({ termsVersion }: { termsVersion: string }) =>
      postCheckout({ termsVersion }),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  return mutation;
};
