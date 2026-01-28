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
import type { Inputs } from "@/models/loginForm";
import Link from "next/link";
import { motion } from "motion/react";
import { useLogin } from "@/queries/useLogin";

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useLogin();

  const handleSubmitFormHandler = async (data: Inputs) => {
    await mutateAsync({
      email: data.email.trim(),
      password: data.password.trim(),
    });
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
          <CardTitle>Zaloguj się</CardTitle>
          <CardDescription>
            Wprowadź swoje dane poniżej, aby zalogować się do swojego konta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitForm(handleSubmitFormHandler)}>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
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
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Hasło</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  {...registerForm("password", {
                    required: "Hasło jest wymagane",
                  })}
                />
                <FieldError errors={errors.password ? [errors.password] : []} />
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={!isValid || isPending}>
                    Zaloguj się
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    Nie masz jeszcze konta?{" "}
                    <Link href="/register">Zarejestruj się</Link>
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
