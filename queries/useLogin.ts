import { login } from "@/services/login.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string, password: string }) => login(email, password),
    onSuccess: () => {
      router.push("/course");
    },
    onError: (error) => {
      // TODO: Implement toast notification
    },
  });
  
  return mutation;
};