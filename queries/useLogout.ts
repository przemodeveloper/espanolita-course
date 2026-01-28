import { useNotificationContext } from "@/context/notification-context";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const supabase = createClient();
  const router = useRouter();
  const { notify } = useNotificationContext();
  const mutation = useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: () => {
      notify("Nie udało się wylogować, sprawdź swoje dane i spróbuj ponownie", "error");
    },
  });
  return mutation;
};