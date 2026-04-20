import { useNotificationContext } from "@/context/notification-context";
import { login } from "@/services/login.service";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { notify } = useNotificationContext();
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
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        notify("Nieprawidłowy email lub hasło", "error");
        return;
      }
      notify("Wystąpił błąd, spróbuj ponownie", "error");
    },
  });

  return mutation;
};
