import { z } from "zod";
import { CURRENT_TERMS_VERSION } from "@/lib/terms";

export const loginBodySchema = z.object({
  email: z.string().trim().email("Podaj prawidłowy adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
  turnstileToken: z.string().min(1, "Brak tokenu sprawdzania zabezpieczeń."),
});

export const registerBodySchema = z.object({
  firstName: z.string().trim().min(1, "Brak wymaganych pól."),
  lastName: z.string().trim().min(1, "Brak wymaganych pól."),
  email: z.string().trim().email("Podaj prawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków."),
  turnstileToken: z.string().min(1, "Brak tokenu sprawdzania zabezpieczeń."),
});

export const checkoutBodySchema = z.object({
  termsVersion: z.literal(CURRENT_TERMS_VERSION, {
    error: "Nieaktualna wersja regulaminu",
  }),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  optionId: z.string().uuid().optional(),
  answerText: z.string().optional(),
});

export const submitBodySchema = z.object({
  answers: z.array(submitAnswerSchema).min(1, "Brak odpowiedzi"),
});

export const thankYouBodySchema = z.object({
  customerEmail: z.string().trim().email(),
  customerName: z.string().trim().optional(),
  courseUrl: z.string().trim().url(),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
export type RegisterBody = z.infer<typeof registerBodySchema>;
export type CheckoutBody = z.infer<typeof checkoutBodySchema>;
export type SubmitBody = z.infer<typeof submitBodySchema>;
export type ThankYouBody = z.infer<typeof thankYouBodySchema>;

export function zodErrorMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Nieprawidłowe dane wejściowe";
}
