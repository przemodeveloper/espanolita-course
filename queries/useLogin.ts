import { login } from "@/services/login.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: ({
      email,
      password,
      turnstileToken,
    }: {
      email: string;
      password: string;
      turnstileToken: string;
    }) => login(email, password, turnstileToken),
    onSuccess: () => {
      router.push("/course");
      router.refresh();
    },
  });

  return mutation;
};
