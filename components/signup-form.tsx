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
import { useRegister } from "@/queries/useRegister";
import { useForm } from "react-hook-form";
import type { Inputs } from "@/models/signupForm";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { mutateAsync: register } = useRegister();

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors, isValid },
    getValues,
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmitFormHandler = async (data: Inputs) => {
    await register({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    });
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Zarejestruj się</CardTitle>
        <CardDescription>
          Wprowadź swoje dane poniżej, aby utworzyć swoje konto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitForm(handleSubmitFormHandler)}>
          <FieldGroup>
            <Field data-invalid={!!errors.firstName}>
              <FieldLabel htmlFor="firstName">Imię</FieldLabel>
              <Input
                id="firstName"
                type="text"
                aria-invalid={!!errors.firstName}
                {...registerForm("firstName", {
                  required: "Imię jest wymagane",
                  minLength: {
                    value: 2,
                    message: "Imię musi mieć co najmniej 2 znaki",
                  },
                })}
              />
              <FieldError errors={errors.firstName ? [errors.firstName] : []} />
            </Field>
            <Field data-invalid={!!errors.lastName}>
              <FieldLabel htmlFor="lastName">Nazwisko</FieldLabel>
              <Input
                id="lastName"
                type="text"
                aria-invalid={!!errors.lastName}
                {...registerForm("lastName", {
                  required: "Nazwisko jest wymagane",
                  minLength: {
                    value: 2,
                    message: "Nazwisko musi mieć co najmniej 2 znaki",
                  },
                })}
              />
              <FieldError errors={errors.lastName ? [errors.lastName] : []} />
            </Field>
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
                  minLength: {
                    value: 8,
                    message: "Hasło musi mieć co najmniej 8 znaków",
                  },
                })}
              />
              <FieldError errors={errors.password ? [errors.password] : []} />
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-password">
                Potwierdź hasło
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                aria-invalid={!!errors.confirmPassword}
                {...registerForm("confirmPassword", {
                  required: "Potwierdzenie hasła jest wymagane",
                  validate: (value) =>
                    value === getValues("password") ||
                    "Hasła nie są identyczne",
                })}
              />
              <FieldError
                errors={errors.confirmPassword ? [errors.confirmPassword] : []}
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={!isValid}>
                  Utwórz konto
                </Button>
                <FieldDescription className="px-6 text-center">
                  Masz już konto? <a href="/login">Zaloguj się</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
