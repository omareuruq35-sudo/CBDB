import type { Metadata } from "next";
import ChatbotWrapper from "@/components/ChatbotWrapper";
import NotificationListener from "@/components/NotificationListener";
import { Cairo, Roboto, Arimo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "@/components/blood-donation/navbar";
import { Footer } from "@/components/blood-donation/footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-arimo",
});

export const metadata: Metadata = {
  title: "البنك المركزي المصري للتبرع بالدم",
  description:
    "منصة مركزية لتنظيم وإدارة التبرع بالدم وفقاً للمعايير الصحية المعتمدة",

  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${roboto.variable} ${arimo.variable} font-sans antialiased`}
      >
        <NotificationListener />

        <Navbar />

        <main className="pt-[190px] md:pt-[200px]">
          {children}
        </main>

        <Footer />

        <Analytics />
        <ChatbotWrapper />
      </body>
    </html>
  );
}