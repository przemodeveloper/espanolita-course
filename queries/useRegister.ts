import { register } from "@/services/register.service";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: ({ firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => register(firstName, lastName, email, password),
  });
  return mutation;
};