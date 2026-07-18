import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bhraman — AI Travel Planner for India",
  description: "The smartest way to plan your next Indian adventure. Powered by Gemini AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#0A0B0F] text-[#F0F2F8] antialiased">{children}</body>
    </html>
  );
}
