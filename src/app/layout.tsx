import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ศูนย์รับเคลมสินค้า | Claim Portal",
  description: "ระบบรับเคลมสินค้า - Submit your warranty claim online",
  keywords: ["เคลม", "ประกัน", "warranty", "claim", "Arizer", "PAX", "S&B", "Dynavap"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.variable}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
