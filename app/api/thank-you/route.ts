import { Resend } from "resend";
import { NextResponse } from "next/server";
import ThankYouEmail from "@/components/thank-you-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured" },
      { status: 500 },
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { customerEmail, customerName, courseUrl } = body as {
    customerEmail?: string;
    customerName?: string;
    courseUrl?: string;
  };

  if (!customerEmail?.trim()) {
    return NextResponse.json(
      { error: "customerEmail is required" },
      { status: 400 },
    );
  }
  if (!courseUrl?.trim()) {
    return NextResponse.json(
      { error: "courseUrl is required" },
      { status: 400 },
    );
  }

  const { data, error } = await resend.emails.send({
    from: "Españolita <biuro@espanolita.pl>",
    to: customerEmail.trim(),
    subject:
      "Dziękujemy za kupienie dostępu do zadań maturalnych Españolita! 🎉",
    react: ThankYouEmail({
      customerName: customerName?.trim() || "Kliencie",
      courseUrl: courseUrl.trim(),
    }),
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ data });
}
