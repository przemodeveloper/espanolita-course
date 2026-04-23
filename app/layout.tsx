import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CourseContext } from "@/context/course-context";
import { NavbarContainer } from "@/components/navbar-container";
import { NotificationContextProvider } from "@/context/notification-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://matura-espanolita.pl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Matura Españolita – zadania maturalne z hiszpańskiego",
    template: "%s | Matura Españolita",
  },
  description:
    "Matura Españolita (Espanolita) – skuteczne przygotowanie do matury z języka hiszpańskiego. Wszystkie typy zadań maturalnych z rozwiązaniami i wyjaśnieniami.",
  keywords: [
    "matura espanolita",
    "matura españolita",
    "espanolita",
    "españolita",
    "matura hiszpański",
    "matura z hiszpańskiego",
    "zadania maturalne hiszpański",
    "matura język hiszpański",
    "przygotowanie do matury hiszpański",
  ],
  applicationName: "Matura Españolita",
  authors: [{ name: "Matura Españolita" }],
  creator: "Matura Españolita",
  publisher: "Matura Españolita",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
    siteName: "Matura Españolita",
    title: "Matura Españolita – zadania maturalne z hiszpańskiego",
    description:
      "Skuteczne przygotowanie do matury z języka hiszpańskiego. Wszystkie typy zadań maturalnych z rozwiązaniami.",
    images: [
      {
        url: "/spanish-stairs.jpg",
        width: 1200,
        height: 630,
        alt: "Matura Españolita",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matura Españolita – zadania maturalne z hiszpańskiego",
    description:
      "Skuteczne przygotowanie do matury z języka hiszpańskiego. Wszystkie typy zadań maturalnych z rozwiązaniami.",
    images: ["/spanish-stairs.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Matura Españolita",
        alternateName: ["Matura Espanolita", "Españolita", "Espanolita"],
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Matura Españolita",
        alternateName: "Matura Espanolita",
        description:
          "Zadania maturalne z języka hiszpańskiego – przygotowanie do matury.",
        inLanguage: "pl-PL",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang="pl">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw JSON injection; content is fully static and serialized.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CourseContext>
          <NotificationContextProvider>
            <NavbarContainer />
            <main className="flex-1 pt-[64px]">{children}</main>
          </NotificationContextProvider>
        </CourseContext>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
