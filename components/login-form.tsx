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
import { Controller, useForm } from "react-hook-form";
import type { Inputs } from "@/models/loginForm";
import Link from "next/link";
import { motion } from "motion/react";
import { useLogin } from "@/queries/useLogin";
import Turnstile from "react-turnstile";

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      turnstileToken: "",
    },
  });

  const { mutate, isPending } = useLogin();

  const handleSubmitFormHandler = (data: Inputs) => {
    mutate({
      email: data.email.trim(),
      password: data.password.trim(),
      turnstileToken: data.turnstileToken,
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
              <Field>
                <Controller
                  name="turnstileToken"
                  control={control}
                  rules={{ required: true }}
                  render={() => (
                    <Turnstile
                      sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onVerify={(token) =>
                        setValue("turnstileToken", token, {
                          shouldValidate: true,
                        })
                      }
                      onExpire={() =>
                        setValue("turnstileToken", "", { shouldValidate: true })
                      }
                      onError={() =>
                        setValue("turnstileToken", "", { shouldValidate: true })
                      }
                    />
                  )}
                />
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
