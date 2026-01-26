import { register } from "@/services/register.service";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string, password: string }) => register(email, password),
  });
  return mutation;
};