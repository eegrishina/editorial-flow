import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Editorial Flow — Publishing Management System",
  description:
    "Advanced Kanban & Bento Dashboard for book production workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      {/* Подключаем переменные шрифтов к body и задаем базовый фон */}
      <body
        className={`${sans.variable} ${serif.variable} ${mono.variable} min-h-full bg-ground text-ink font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
