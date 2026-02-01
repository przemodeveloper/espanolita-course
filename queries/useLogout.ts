import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const supabase = createClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });
  return mutation;
};