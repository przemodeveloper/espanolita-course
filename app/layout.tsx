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

export const metadata: Metadata = {
  title: "Matura Españolita",
  description: "Matura Españolita, zadania maturalne w języku hiszpańskim",
  keywords: ["matura", "hiszpański", "españolita", "zadania"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
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
