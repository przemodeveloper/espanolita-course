import { useMutation } from "@tanstack/react-query";
import { useNotificationContext } from "@/context/notification-context";
import { resetPassword } from "@/services/reset-password.service";

export const useResetPassword = () => {
  const { notify } = useNotificationContext();
  const mutation = useMutation({
    mutationFn: (password: string) => resetPassword(password),
    onSuccess: () => {
      notify("Hasło zostało zresetowane", "success");
    },
    onError: () => {
      notify("Wystąpił błąd, spróbuj ponownie", "error");
    },
  });
  return mutation;
};
