"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { Inputs } from "@/models/forgotPasswordForm";
import Link from "next/link";
import { motion } from "motion/react";
import { useForgotPassword } from "@/queries/useForgotPassword";
import { CheckCircleIcon } from "lucide-react";

export function ForgotPasswordForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const handleSendResetPasswordLink = (data: Inputs) => {
    forgotPassword(data.email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <Card {...props}>
        <CardHeader>
          <CardTitle>Nie pamiętasz hasła?</CardTitle>
          <CardDescription>
            Podaj adres email powiązany z kontem. Wyślemy Ci link do resetu
            hasła.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
              <p className="text-sm text-gray-500">
                Email został wysłany. Sprawdź swoją skrzynkę email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitForm(handleSendResetPasswordLink)}>
              <FieldGroup>
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
                  <Input
                    id="forgot-password-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...registerForm("email", {
                      required: "Email jest wymagany",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Podaj prawidłowy adres email",
                      },
                    })}
                  />
                  <FieldError errors={errors.email ? [errors.email] : []} />
                </Field>
                <FieldGroup>
                  <Field>
                    <Button type="submit" disabled={!isValid || isPending}>
                      Wyślij link resetujący
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      <Link href="/login">Wróć do logowania</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
