import { useMutation } from "@tanstack/react-query";
import { useNotificationContext } from "@/context/notification-context";
import { resetPassword } from "@/services/reset-password.service";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export const useResetPassword = () => {
  const { notify } = useNotificationContext();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (password: string) => resetPassword(password),
    onSuccess: async () => {
      notify("Hasło zostało zresetowane", "success");
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    },
    onError: () => {
      notify("Wystąpił błąd, spróbuj ponownie", "error");
    },
  });
  return mutation;
};
