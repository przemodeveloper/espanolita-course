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
import type { Inputs } from "@/models/resetPasswordForm";
import Link from "next/link";
import { motion } from "motion/react";

export function ResetPasswordForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors, isValid },
    getValues,
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <Card {...props}>
        <CardHeader>
          <CardTitle>Ustaw nowe hasło</CardTitle>
          <CardDescription>
            Wprowadź nowe hasło dla swojego konta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmitForm(() => {
              // API integration pending
            })}
          >
            <FieldGroup>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="reset-password">Nowe hasło</FieldLabel>
                <Input
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...registerForm("password", {
                    required: "Hasło jest wymagane",
                    minLength: {
                      value: 8,
                      message: "Hasło musi mieć co najmniej 8 znaków",
                    },
                  })}
                />
                <FieldError errors={errors.password ? [errors.password] : []} />
              </Field>
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="reset-confirm-password">
                  Potwierdź hasło
                </FieldLabel>
                <Input
                  id="reset-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...registerForm("confirmPassword", {
                    required: "Potwierdzenie hasła jest wymagane",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Hasła nie są identyczne",
                  })}
                />
                <FieldError
                  errors={
                    errors.confirmPassword ? [errors.confirmPassword] : []
                  }
                />
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={!isValid}>
                    Zapisz nowe hasło
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    <Link href="/login">Wróć do logowania</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
