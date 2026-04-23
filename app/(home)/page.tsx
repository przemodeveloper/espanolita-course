import { LandingPageContent } from "@/components/landing-page-content";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://matura-espanolita.pl";

export const metadata: Metadata = {
  title: "Matura Españolita – zadania maturalne z hiszpańskiego",
  description:
    "Matura Españolita (Espanolita) – przygotuj się do matury z języka hiszpańskiego. Wszystkie typy zadań maturalnych z rozwiązaniami i wyjaśnieniami.",
  keywords: [
    "matura espanolita",
    "matura españolita",
    "espanolita",
    "españolita",
    "matura hiszpański",
    "matura z hiszpańskiego",
    "zadania maturalne hiszpański",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    url: siteUrl,
    title: "Matura Españolita – zadania maturalne z hiszpańskiego",
    description:
      "Przygotuj się do matury z języka hiszpańskiego z Matura Españolita. Wszystkie typy zadań maturalnych.",
  },
};

export default function Home() {
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Matura Españolita – zadania maturalne z hiszpańskiego",
    alternateName: "Matura Espanolita",
    description:
      "Kurs online z zadaniami maturalnymi z języka hiszpańskiego. Wszystkie typy zadań, które pojawią się na maturze.",
    inLanguage: "pl",
    url: siteUrl,
    provider: {
      "@type": "Organization",
      name: "Matura Españolita",
      sameAs: siteUrl,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      inLanguage: "pl",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw JSON injection; content is fully static and serialized.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LandingPageContent />
    </>
  );
}
