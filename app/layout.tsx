import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Substack Studio - Schedule, Analyze & Optimize Your Substack",
  description: "Professional Substack management studio with scheduling, analytics, growth tracking, and performance insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
