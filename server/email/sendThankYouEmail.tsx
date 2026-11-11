import { Resend } from "resend";
import ThankYouEmail from "@/components/thank-you-email";
import { DomainError } from "@/server/errors";

export type ThankYouEmailInput = {
  customerEmail: string;
  customerName?: string;
  courseUrl: string;
};

export async function sendThankYouEmail(input: ThankYouEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new DomainError("RESEND_API_KEY nie jest skonfigurowany", 500);
  }

  const customerEmail = input.customerEmail.trim();
  const courseUrl = input.courseUrl.trim();
  const customerName = input.customerName?.trim() || "Kliencie";

  if (!customerEmail) {
    throw new DomainError("customerEmail is required", 400);
  }
  if (!courseUrl) {
    throw new DomainError("courseUrl is required", 400);
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "Españolita <noreply@matura-espanolita.pl>",
    replyTo: "biuro@espanolita.pl",
    to: customerEmail,
    subject:
      "Dziękujemy za kupienie dostępu do zadań maturalnych Españolita! 🎉",
    react: (
      <ThankYouEmail customerName={customerName} courseUrl={courseUrl} />
    ),
  });

  if (error) {
    throw new DomainError(
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: string }).message)
        : "Nie udało się wysłać e-maila",
      500,
    );
  }

  return data;
}
