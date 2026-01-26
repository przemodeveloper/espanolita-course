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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Zarejestruj się</CardTitle>
        <CardDescription>
          Wprowadź swoje dane poniżej, aby utworzyć swoje konto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Imię i nazwisko</FieldLabel>
              <Input id="name" type="text" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" required />
              <FieldDescription>
                Użyjemy tego adresu email do kontaktu z Tobą. Nie udostępnimy go
                nikomu innemu.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Hasło</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                Musi mieć co najmniej 8 znaków.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Potwierdź hasło
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>Potwierdź swoje hasło.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Utwórz konto</Button>
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
