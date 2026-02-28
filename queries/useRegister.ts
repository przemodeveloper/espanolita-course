import { register } from "@/services/register.service";
import { useMutation } from "@tanstack/react-query";
import { useNotificationContext } from "@/context/notification-context";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const { notify } = useNotificationContext();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => register(firstName, lastName, email, password),
    onSuccess: () => {
      notify(
        "Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.",
        "success",
      );
      router.push("/login");
    },
    onError: () => {
      notify("Rejestracja nie powiodła się, spróbuj ponownie", "error");
    },
  });
  return mutation;
};
