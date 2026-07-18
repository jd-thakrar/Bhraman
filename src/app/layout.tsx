import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhraman — AI Travel Planner for India",
  description: "The smartest way to plan your next Indian adventure. Powered by Gemini AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0A0B0F] text-[#F0F2F8] antialiased" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
