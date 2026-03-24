import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CourseContext } from "@/context/course-context";
import { NavbarContainer } from "@/components/navbar-container";
import { NotificationContextProvider } from "@/context/notification-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kurs maturalny Españolita",
  description:
    "Kurs maturalny Españolita, zadania maturalne w języku hiszpańskim",
  keywords: ["kurs maturalny", "hiszpański", "matura", "españolita", "zadania"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
