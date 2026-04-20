import { useNotificationContext } from "@/context/notification-context";
import { forgotPassword } from "@/services/forgot-password.service";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  const { notify } = useNotificationContext();
  const mutation = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      notify("Email został wysłany", "success");
    },
    onError: () => {
      notify("Wystąpił błąd, spróbuj ponownie", "error");
    },
  });
  return mutation;
};
